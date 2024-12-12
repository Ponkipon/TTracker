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
                    <td><button class="description-toggle">Show Description</button></td>
                </tr>
                <tr class="details-row" style="display: none;">
                    <td colspan="7">
                        <div class="description-content">
                            ${timer.description || 'No description.'}
                        </div>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        });
}
loadAdminTimers();

document.querySelector('#admin-table tbody').addEventListener('click', function(e) {
    if (e.target.classList.contains('description-toggle')) {
        const detailsRow = e.target.closest('tr').nextElementSibling;
        if (detailsRow && detailsRow.classList.contains('details-row')) {
            detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
        }
    }
});