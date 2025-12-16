const weekSubjectsData = [
    { koma: 1, subjects: [
        {code: "4J012"}, 
        {code: "None"}, 
        {code: "4J018"}, 
        {code: "4J003"}, 
        {code: "4J015"},
    ]},
    { koma: 2, subjects: [
        {code: "4J023"}, 
        {code: "4J014"}, 
        {code: "4J007"}, 
        {code: "4J036"}, 
        {code: "4J019"},
    ]},
    { koma: 3, subjects: [
        {code: "4J037"}, 
        {code: "4J002"}, 
        {code: "None"}, 
        {code: "4J004"}, 
        {code: "4J019"},
    ]},
    { koma: 4, subjects: [
        {code: "4J024"}, 
        {code: "4J034"}, 
        {code: "None"}, 
        {code: "4J031"}, 
        {code: "None"},
    ]},
    { koma: 5, subjects: [
        {code: "4J029"}, 
        {code: "4J025"}, 
        {code: "None"}, 
        {code: "None"}, 
        {code: "None"},
    ]},
];

const subjects = {
    "4J002": {name: "比較社会史", teacher: "宮川[剛]"},
    "4J003": {name: "保健・体育", teacher: "(高橋[伸])"},
    "4J004": {name: "英語", teacher: "(ウィルソン)"},
    "4J007": {name: "応用数学Ⅱ", teacher: "碓氷"},
    "4J012": {name: "電子回路", teacher: "築地"},
    "4J014": {name: "計算機ソフトウェア", teacher: "川本"},
    "4J015": {name: "システムプログラム", teacher: "(李)"},
    "4J018": {name: "情報数学基礎", teacher: "荒川"},
    "4J019": {name: "電子情報工学実験実習", teacher: "渡邊[俊]・J科教員"},
    "4J023": {name: "[オブジェクト指向プログラミング]", teacher: "市村[智]"},
    "4J024": {name: "信号処理", teacher: "川本"},
    "4J025": {name: "[生命科学総論]", teacher: "石川"},
    "4J029": {name: "[複合創造実験]", teacher: "市村[智]・佐々木・平社"},
    "4J031": {name: "電磁気学演習", teacher: "雑賀"},
    "4J034": {name: "応用物理ⅡB", teacher: "(大嶋)"},
    "4J036": {name: "応用物理ⅡD", teacher: "雑賀"},
    "4J037": {name: "[実用英語演習Ⅱ]", teacher: "熊谷[健]"},
};

const getSubjectNameByCode = (code) => {
    const data = subjects[code];
    return data ? data.name : '科目不明';
};

const getSubjectTeacherByCode = (code) => {
    const data = subjects[code];
    return data ? data.teacher : '教員不明';
};

module.exports = { 
    weekSubjectsData, 
    subjects, 
    getSubjectNameByCode, 
    getSubjectTeacherByCode 
};