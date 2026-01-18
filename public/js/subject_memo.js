const absenceInput = document.querySelector('#absence');

// ページ読み込み時に保存されたメモを表示
document.addEventListener('DOMContentLoaded', (event) => {
    const h1 = document.querySelector('h1');
    const subjectCode = h1.dataset.subjectCode;
    const memoArea = document.getElementById('memo-area');
    const savedMemo = localStorage.getItem(`memo_${subjectCode}`);
    const savedAbsence = localStorage.getItem(`absence_${subjectCode}`);
    if (savedMemo) {
        memoArea.value = savedMemo;
    }
    if (savedAbsence) {
        absenceInput.value = savedAbsence;
    }
});

function saveMemo() {
    const memoArea = document.getElementById('memo-area');
    const text = memoArea.value;
    const h1 = document.querySelector('h1');
    const subjectCode = h1.dataset.subjectCode;
    localStorage.setItem(`memo_${subjectCode}`, text);
    Swal.fire({
        title: 'メモが保存されました',
        text: 'あなたのメモは正常に保存されました。',
    });
}

absenceInput.addEventListener('input', () => {
    const h1 = document.querySelector('h1');
    const subjectCode = h1.dataset.subjectCode;
    const absenceValue = absenceInput.value;
    localStorage.setItem(`absence_${subjectCode}`, absenceValue);
});