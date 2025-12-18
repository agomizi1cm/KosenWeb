// ====================================
// 年間予定データとカレンダー生成ロジック
// ====================================


  
  /**
   * 指定した日付の予定情報を取得する
   * @param {string} dateString YYYY-MM-DD
   * @returns {object} { markType, title }
   */
  function getScheduleInfo(dateString) {
    const dateObj = new Date(dateString);
  
    let markType = "class-day";
    let titles = [];
  
    for (const item of schedules) {
      // 単日イベント
      if (item.date === dateString) {
        markType = item.type;
        if (item.title) titles.push(item.title);
      }
  
      // 期間イベント
      if (item.dateFrom && item.dateTo) {
        if (dateString >= item.dateFrom && dateString <= item.dateTo) {
          markType = item.type;
          if (item.title) titles.push(item.title);
        }
      }
    }
  
    // 日曜日は休日扱い
    if (dateObj.getDay() === 0 && markType === "class-day") {
      markType = "holiday";
    }
  
    return {
      markType,
      title: titles.join("<br>")
    };
  }
  
  /**
   * 指定した年度の年間カレンダーを生成する
   * @param {number} year
   */
  function generateYearCalendar(year) {
    const container = document.getElementById("calendar-container");
    const yearDisplay = document.getElementById("current-year");
  
    container.innerHTML = "";
    yearDisplay.textContent = year;
  
    // 4月始まりで12か月生成
    for (let i = 0; i < 12; i++) {
      const month = (3 + i) % 12 + 1;
      const targetYear = year + (i >= 9 ? 1 : 0);
  
      const firstDay = new Date(targetYear, month - 1, 1);
      const lastDate = new Date(targetYear, month, 0).getDate();
  
      const monthDiv = document.createElement("div");
      monthDiv.className = "month-calendar";
      monthDiv.innerHTML = `<h3>${month}月</h3>`;
  
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            <th>日</th><th>月</th><th>火</th><th>水</th>
            <th>木</th><th>金</th><th>土</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
  
      const tbody = table.querySelector("tbody");
      let row = tbody.insertRow();
  
      // 空白セル
      for (let j = 0; j < firstDay.getDay(); j++) {
        row.insertCell();
      }
  
      for (let day = 1; day <= lastDate; day++) {
        if (row.cells.length === 7) row = tbody.insertRow();
  
        const cell = row.insertCell();
        const fullDate = `${targetYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  
        const { markType, title } = getScheduleInfo(fullDate);
        cell.className = `day-cell ${markType}`;
        cell.innerHTML = `
          <div class="day-number">${day}</div>
          <div class="schedule-entry">${title}</div>
        `;
      }
  
      monthDiv.appendChild(table);
      container.appendChild(monthDiv);
    }
  }
  
  // ページ読み込み後に実行
  document.addEventListener("DOMContentLoaded", () => {
    generateYearCalendar(2025);
  });
  