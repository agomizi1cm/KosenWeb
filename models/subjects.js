const { format, addDays } = require('date-fns');

const weekSubjectsData = [
    [{code: "4J012", isRescheduled: false}, {code: "Free", isRescheduled: false}, {code: "4J018", isRescheduled: false}, {code: "4J003", isRescheduled: false}, {code: "4J015", isRescheduled: false}],   // 1コマ目
    [{code: "4J023", isRescheduled: false}, {code: "4J014", isRescheduled: false}, {code: "4J007", isRescheduled: false}, {code: "4J036", isRescheduled: false}, {code: "4J019", isRescheduled: false}],  // 2コマ目
    [{code: "4J037", isRescheduled: false}, {code: "4J002", isRescheduled: false}, {code: "Free", isRescheduled: false}, {code: "4J004", isRescheduled: false}, {code: "4J019", isRescheduled: false}],   // 3コマ目
    [{code: "4J024", isRescheduled: false}, {code: "4J034", isRescheduled: false}, {code: "Free", isRescheduled: false}, {code: "4J031", isRescheduled: false}, {code: "Free", isRescheduled: false}],    // 4コマ目
    [{code: "4J029", isRescheduled: false}, {code: "4J025", isRescheduled: false}, {code: "Free", isRescheduled: false}, {code: "Free", isRescheduled: false}, {code: "Free", isRescheduled: false}],     // 5コマ目
];

const subjectList = {
    "Free": {name: "", teacher: "", isElective: false},
    "None": {name: "", teacher: "", isElective: false},
    "4J002": {name: "比較社会史", teacher: "宮川[剛]", isElective: false},
    "4J003": {name: "保健・体育", teacher: "(高橋[伸])", isElective: false},
    "4J004": {name: "英語", teacher: "(ウィルソン)", isElective: false},
    "4J007": {name: "応用数学Ⅱ", teacher: "碓氷", isElective: false},
    "4J012": {name: "電子回路", teacher: "築地", isElective: false},
    "4J014": {name: "計算機ソフトウェア", teacher: "川本", isElective: false},
    "4J015": {name: "システムプログラム", teacher: "(李)", isElective: false},
    "4J018": {name: "情報数学基礎", teacher: "荒川", isElective: false},
    "4J019": {name: "電子情報工学実験実習", teacher: "渡邊[俊]・J科教員", isElective: false},
    "4J023": {name: "[オブジェクト指向プログラミング]", teacher: "市村[智]", isElective: true},
    "4J024": {name: "信号処理", teacher: "川本", isElective: false},
    "4J025": {name: "[生命科学総論]", teacher: "石川", isElective: true},
    "4J029": {name: "[複合創造実験]", teacher: "市村[智]・佐々木・平社", isElective: true},
    "4J031": {name: "電磁気学演習", teacher: "雑賀", isElective: false},
    "4J034": {name: "応用物理ⅡB", teacher: "(大嶋)", isElective: false},
    "4J036": {name: "応用物理ⅡD", teacher: "雑賀", isElective: false},
    "4J037": {name: "実用英語演習Ⅱ", teacher: "熊谷[健]", isElective: false},
};

const getSubjectNameByCode = (code) => {
    const data = subjectList[code];
    return data ? data.name : '科目不明';
};

const getSubjectTeacherByCode = (code) => {
    const data = subjectList[code];
    return data ? data.teacher : '教員不明';
};

const getSubjectIsElectiveByCode = (code) => {
    const data = subjectList[code];
    return data ? data.isElective : false;
};

// 日曜日の日付:Dateを受け取り、その週の授業コードリストを返す関数
const getWeekSubjectCodeList = (sunday, rescheduleClasses) => {
    if (!sunday || sunday.getDay() !== 0) {
        throw new Error('The provided date is not a Sunday.');
    }

    // 基本の時間割データをコピー
    const weekSubjectCodeList = structuredClone(weekSubjectsData);

    // 振替授業の適用
    for (let day = 1; day <= 6; day++) {
        const date = addDays(sunday, day);
        const dateString = format(date, 'yyyy-MM-dd');

        const dailyChanges = rescheduleClasses[dateString];
        if (dailyChanges && Array.isArray(dailyChanges)) {
            dailyChanges.forEach(({koma, subjectCode}) => {
                const komaIndex = koma - 1;
                const dayIndex = day - 1;
                if (weekSubjectCodeList[komaIndex] && weekSubjectCodeList[komaIndex][dayIndex]) {
                    weekSubjectCodeList[komaIndex][dayIndex] = {code: subjectCode, isRescheduled: true};
                }
            });
        }
    }

    return weekSubjectCodeList;
}

module.exports = {
    subjectList,
    getSubjectNameByCode, 
    getSubjectTeacherByCode,
    getWeekSubjectCodeList,
    getSubjectIsElectiveByCode
};