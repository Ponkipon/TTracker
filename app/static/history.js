import { formatDate } from "./base.js";
import { getDuration } from "./base.js";

function loadHistory() {
    fetch('/timer/view_timers')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#history-table tbody');
            tableBody.innerHTML = '';
            data.timers.forEach(timer => {
                const row = `<tr> 
                    <td>${formatDate(timer.start_time) || ''}</td>
                    <td>${formatDate(timer.end_time) || ''}</td>
                    <td>${getDuration(timer.start_time, timer.end_time) || ''}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        });
}
loadHistory();