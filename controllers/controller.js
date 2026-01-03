const subjects = require('../models/subjects');
const axios = require('axios');
const cheerio = require('cheerio');

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
    const sundayParam = req.query.sunday;
    const getWeekSubjectCodeList = subjects.getWeekSubjectCodeList;
    if (!sundayParam) {
        return res.status(400).json({ error: 'Missing sunday parameter' });
    }
    const sundayDate = new Date(sundayParam);
    if (isNaN(sundayDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format for sunday parameter' });
    }
    if (sundayDate.getDay() !== 0) {
        return res.status(400).json({ error: 'The sunday parameter must be a Sunday date' });
    }
    const weekSchedule = getWeekSubjectCodeList(sundayDate);
    res.json({ weekSchedule: weekSchedule });
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
