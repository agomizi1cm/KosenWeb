document.getElementById("addClassChangeForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        date: document.getElementById("date").value,
        koma: document.getElementById("koma").value,
        subjectCode: document.getElementById("subjectCode").value
    };

    const response = await fetch('/api/reschedule_classes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        alert('授業変更が正常に追加されました。');
        document.getElementById("addClassChangeForm").reset();
    }
});