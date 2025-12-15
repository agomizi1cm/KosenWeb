const { render } = require('ejs');
const subjects = require('../models/subjects');

function getMonth() {
    const now = new Date();
    return now.getMonth() + 1; // JavaScriptの月は0から始まるため、1を加算
}

// --------------------------------------------------
// 【追加】テスト日程PDFの情報を取得してレンダリングする関数
// --------------------------------------------------
exports.renderSchedulePage = async (req, res) => {
    const targetUrl = 'https://www.gunma-ct.ac.jp/forstudent/event/';
    let pdfUrl = null;
    let scrapeError = null; 

    try {
        // 1. 外部サイトのHTMLを取得
        const response = await axios.get(targetUrl, { timeout: 10000 }); 
        const $ = cheerio.load(response.data);

        // 2. HTMLを解析し、PDFリンクを検索
        $('a').each((i, element) => {
            const linkText = $(element).text();
            const href = $(element).attr('href');

            if ((linkText.includes('試験日程表') || linkText.includes('日程表')) && href && href.endsWith('.pdf')) {
                
                // 相対パスを絶対パスに変換
                if (href.startsWith('/')) {
                    pdfUrl = 'https://www.gunma-ct.ac.jp' + href;
                } else if (href.startsWith('http')) {
                    pdfUrl = href; 
                }
                
                return false; // 最初に見つかった最新のリンクを採用し、ループを終了
            }
        });

        if (!pdfUrl) {
            scrapeError = '外部サイトのHTML内から、該当する「試験日程表」PDFリンクが見つかりませんでした。';
        }

    } catch (error) {
        console.error('Webスクレイピング中にエラーが発生しました:', error.message);
        scrapeError = `外部サイトへの接続またはデータの取得に失敗しました。詳細: ${error.message}`;
    }

    // 取得結果をEJSテンプレートに渡す
    res.render('test_schedule', { 
        title: '最新のテスト日程表', 
        pdfUrl: pdfUrl, 
        error: scrapeError,
        targetUrl: targetUrl // エラー時に公式サイトへのリンクを表示するために渡す
    });
};

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