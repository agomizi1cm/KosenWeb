document.getElementById("deleteClassChangeForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        date: document.getElementById("deleteDate").value,
        koma: document.getElementById("deleteKoma").value
    };

    const response = await fetch('/api/delete_reschedule_class', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
        alert("エラーが発生しました：" + result.error);
    } else {
        alert('授業変更が正常に削除されました。');
        document.getElementById("deleteClassChangeForm").reset();
    }
});