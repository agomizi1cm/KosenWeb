const subjects = require('../models/subjects');
const axios = require('axios');
const cheerio = require('cheerio');

function getMonth() {
    const now = new Date();
    return now.getMonth() + 1; // JavaScriptの月は0から始まるため、1を加算
}

exports.renderHomePage = (req, res) => {
    res.render('index', { title: '高専生活特化アプリ' });
};

exports.renderYearPage = (req, res) => {
    res.render('year', { title: '年間予定表' });
};

exports.renderWeekPage = (req, res) => {
    const weekSubjectsData = subjects.weekSubjectsData;
    const subjectsList = subjects.subjects;
    const getSubjectNameByCode = subjects.getSubjectNameByCode;
    const getSubjectTeacherByCode = subjects.getSubjectTeacherByCode;
    const month = getMonth();
    res.render('week', {
        title: '授業時間割',
        weekSubjectsData: weekSubjectsData,
        subjects: subjectsList,
        getSubjectNameByCode: getSubjectNameByCode,
        getSubjectTeacherByCode: getSubjectTeacherByCode,
        month: month
    });
};

exports.renderSubjectPage = (req, res) => {
    const subjectCode = req.params.code;
    const subjectData = subjects.subjects[subjectCode];

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

exports.renderLibraryPage = (req, res) => {
    const opacUrl = 'https://libopac-c.kosen-k.go.jp/webopac14/cattab.do';
    res.redirect(opacUrl);
};

exports.redirectToYearPage = async (req, res) => {
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

exports.renderLibraryPage = (req, res) => {
    const opacUrl = 'https://libopac-c.kosen-k.go.jp/webopac14/cattab.do';
    res.redirect(opacUrl);
};
