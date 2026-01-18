document.getElementById("addClassChangeForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        date: document.getElementById("date").value,
        koma: document.getElementById("koma").value,
        subjectCode: document.getElementById("subjectCode").value
    };

    const response = await fetch('/api/add_reschedule_class', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (response.status === 409) {
        alert("エラー：" + result.error);
    } else if (!response.ok) {
        alert("エラーが発生しました：" + result.error);
    } else {
        alert('授業変更が正常に追加されました。');
        document.getElementById("addClassChangeForm").reset();
    }
});

document.getElementById("date").addEventListener("change", (e) => {
    const selectedDate = new Date(e.target.value);
    const dayOfWeek = selectedDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
        alert("授業変更は平日にのみ設定可能です。");
        e.target.value = "";
    }
});