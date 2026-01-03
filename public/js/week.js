const currentDate = new Date();
let sundayDate = dateFns.startOfWeek(currentDate, { weekStartsOn: 0 });

const prevweek = document.getElementById("prevweek");
const nextweek = document.getElementById("nextweek");

function generateMonth(date) {
    const day = new Date(date);
    const month = day.getMonth() + 1;
    const monthElement = document.getElementById("month");
    monthElement.textContent = month + "月";
}

function generateSubjectTableHead(sunday) {
    for (let i = 0; i < 7; i++) {
        const dayElement = document.getElementById(`d${i}`);
        const date = dateFns.addDays(sunday, i);
        // 日曜日以外の１日は月/日形式で表示
        if (i !== 0 && date.getDate() === 1) dayElement.textContent = dateFns.format(date, 'M/d');
        else dayElement.textContent = dateFns.format(date, 'd');

        if (dateFns.isToday(date)) {
            dayElement.parentElement.classList.add("today");
        } else {
            dayElement.parentElement.classList.remove("today");
        }
    }
}

async function generateSubjectTableBody(sunday) {
    const response = await fetch(`/api/week_list?sunday=${sunday.toISOString()}`);
    const data = await response.json();
    const tbody = document.getElementById("weekScheduleBody");
    const fragment = document.createDocumentFragment();
    tbody.innerHTML = '';

    for (let koma = 1; koma <= 5; koma++) {
        const tr = document.createElement("tr");
        for (let day = 0; day < 7; day++) {
            const td = document.createElement("td");
            td.classList.add("cell");
            
            if (day === 0 || day === 6) {
                td.classList.add("holiday");
                td.textContent = "";
            } else {
                const {code: subjectCode, isRescheduled} = data.weekSchedule[koma - 1][day - 1];
                if (isRescheduled) {
                    td.classList.add("rescheduled");
                }
                if (subjectCode && subjectCode !== "Free" && subjectCode !== "None") {
                    const { name, teacher, isElective } = await fetch(`/api/subject/${subjectCode}`)
                        .then(res => res.json());
                    if (isElective) {
                        td.classList.add("elective");
                    }
                    td.innerHTML = `<a href="/subject/${subjectCode}"><strong>${name}</strong><br>${teacher}</a>`;
                } else {
                    td.textContent = "";
                }
            }
            tr.appendChild(td);
        }
        fragment.appendChild(tr);
    }
    tbody.appendChild(fragment);
}

prevweek.addEventListener("click", () => {
    sundayDate = dateFns.subDays(sundayDate, 7);
    updateDisplay(sundayDate);
});

nextweek.addEventListener("click", () => {
    sundayDate = dateFns.addDays(sundayDate, 7);
    updateDisplay(sundayDate);
});

function updateDisplay(sunday) {

    generateMonth(sunday);
    generateSubjectTableHead(sunday);
    generateSubjectTableBody(sunday);
}

updateDisplay(sundayDate);
