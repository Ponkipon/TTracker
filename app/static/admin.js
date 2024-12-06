import { formatDate } from "./base.js";
import { getDuration } from "./base.js";

function loadAdminTimers() {
    fetch('/admin/timers')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#admin-table tbody');
            tableBody.innerHTML = '';
            data.timers.forEach(timer => {
                const row = `<tr> 
                    <td>${timer.user_id}</td>
                    <td>${timer.username}</td>
                    <td>${timer.email}</td>
                    <td>${formatDate(timer.start_time) || ''}</td>
                    <td>${formatDate(timer.end_time) || ''}</td>
                    <td>${getDuration(timer.start_time, timer.end_time) || ''}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        });
}
loadAdminTimers();