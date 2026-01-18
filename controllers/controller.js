const subjects = require('../models/subjects');
const axios = require('axios');
const cheerio = require('cheerio');
const { format, addDays } = require('date-fns');
const db = require('../data/db');

// home page
exports.renderHomePage = (req, res) => {
    res.render('index', { title: '高専生活特化アプリ' });
};

// year schedule page
exports.renderYearPage = (req, res) => {
    res.render('year', { title: '年間予定表' });
};

// week schedule page
exports.renderWeekPage = (req, res) => {
    res.render('week', {
        title: '授業時間割'
    });
};

// API to get week schedule data in JSON
exports.getWeekScheduleData = (req, res) => {
    try {
        const sundayParam = req.query.sunday;

        if (!sundayParam) {
            return res.status(400).json({ error: 'Missing sunday parameter' });
        }
        const startDate = new Date(sundayParam);
        const endDate = addDays(startDate, 6);

        if (isNaN(startDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format for sunday parameter' });
        }
        if (startDate.getDay() !== 0) {
            return res.status(400).json({ error: 'The sunday parameter must be a Sunday date' });
        }

        const rows = db.prepare(`
            SELECT date, koma, subject_code 
            FROM rescheduled_classes
            WHERE date BETWEEN ? AND ?
            ORDER BY date, koma
        `).all(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));

        const rescheduleClasses = rows.reduce((acc, row) => {
            if (!acc[row.date]) acc[row.date] = [];
            acc[row.date].push({ koma: row.koma, subjectCode: row.subject_code });
            return acc;
        }, {});

        const getWeekSubjectCodeList = subjects.getWeekSubjectCodeList;
        
        const weekSchedule = getWeekSubjectCodeList(startDate, rescheduleClasses);
        res.json({ weekSchedule: weekSchedule });
    } catch (error) {
        console.error('Error fetching week schedule data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// API to get subject data in JSON
exports.getSubjectData = (req, res) => {
    const subjectCode = req.params.code;
    const subjectName = subjects.getSubjectNameByCode(subjectCode);
    const subjectTeacher = subjects.getSubjectTeacherByCode(subjectCode);
    const isElective = subjects.getSubjectIsElectiveByCode(subjectCode);
    res.json({ name: subjectName, teacher: subjectTeacher, isElective: isElective });
};


// subject detail page
exports.renderSubjectPage = (req, res) => {
    const subjectCode = req.params.code;
    const subjectData = subjects.subjectList[subjectCode];

    if (!subjectData) {
        res.status(404).send('指定の教科が見つかりませんでした。');
        return;
    }
    res.render('subject', {
        title: subjects.getSubjectNameByCode(subjectCode),
        code: subjectCode,
        name: subjects.getSubjectNameByCode(subjectCode),
        teacher: subjects.getSubjectTeacherByCode(subjectCode)
    });
};

// exam schedule page
exports.renderSchedulePage = async (req, res) => {
    const testScheduleUrl = 'https://www.gunma-ct.ac.jp/forstudent/event/';
    try {
        const response = await axios.get(testScheduleUrl);
        const $ = cheerio.load(response.data);
        const url = $("ul.list_link li a:contains('試験日程表')").first().attr('href');
        if (url) {
            res.redirect(url);
        } else {
            res.status(404).send('試験時間割のURLが見つかりませんでした。');
        }
    } catch (error) {
        console.error('Error fetching test schedule:', error);
        res.status(500).send('試験時間割の取得中にエラーが発生しました。');
        return;
    }
};

// redirect to library OPAC page
exports.redirectToLibraryPage = (req, res) => {
    const opacUrl = 'https://libopac-c.kosen-k.go.jp/webopac14/cattab.do';
    res.redirect(opacUrl);
};

// redirect to year schedule page provided official site
exports.redirectToYearSchedulePage = async (req, res) => {
    const yearPageUrl = 'https://www.gunma-ct.ac.jp/forstudent/event/';
    try {
        const response = await axios.get(yearPageUrl);
        const $ = cheerio.load(response.data);
        const url = $("ul.list_link li a:contains('授業・行事計画')").first().attr('href');
        if (url) {
            res.redirect(url);
        } else {
            res.status(404).send('授業・行事計画のURLが見つかりませんでした。');
        }
    } catch (error) {
        console.error('Error fetching year page:', error);
        res.status(500).send('授業・行事計画の取得中にエラーが発生しました。');
        return;
    }
};

// admin page
exports.renderAdminPage = (req, res) => {
    res.render('admin', { title: '管理者ページ' });
}

// API to add reschedule class
exports.addRescheduleClass = (req, res) => {
    try {
        const { date, koma, subjectCode } = req.body;
        if (!date || !koma || !subjectCode) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return res.status(400).json({ error: '授業変更は平日にのみ設定可能です。' });
        }

        const checkStmt = db.prepare('SELECT * FROM rescheduled_classes WHERE date = ? AND koma = ?');
        const existing = checkStmt.get(date, koma);
        if (existing) {
            return res.status(409).json({ error: '指定された日時には既に授業変更が存在します。' });
        }

        const stmt = db.prepare('INSERT INTO rescheduled_classes (date, koma, subject_code) VALUES (?, ?, ?)');
        stmt.run(date, koma, subjectCode);

        res.status(200).json({ message: '授業変更が正常に追加されました。' });
    } catch (error) {
        console.error('Error adding reschedule class:', error);
        res.status(500).json({ error: '授業変更の追加中にエラーが発生しました。' });
    }
}

// API to delete reschedule class
exports.deleteRescheduleClass = (req, res) => {
    try {
        const { date, koma } = req.body;
        if (!date || !koma) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        const stmt = db.prepare('DELETE FROM rescheduled_classes WHERE date = ? AND koma = ?');
        stmt.run(date, koma);
        res.status(200).json({ message: '授業変更が正常に削除されました。' });
    } catch (error) {
        console.error('Error deleting reschedule class:', error);
        res.status(500).json({ error: '授業変更の削除中にエラーが発生しました。' });
    }
}