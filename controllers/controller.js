const { render } = require('ejs');
const subjects = require('../models/subjects');

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

exports.renderTestSchedulePage = (req,res) => {
    res.render('test_schedule',{title: 'テスト日程表'});
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