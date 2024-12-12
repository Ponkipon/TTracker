import { formatDate } from "./base.js";
import { getDuration } from "./base.js";
let currentPage = 1;
const limit = 15;

function loadHistory(page = 1, limit = 15) {
    fetch(`/timer/view_timers?page=${page}&limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#history-table tbody');
            tableBody.innerHTML = '';
            data.timers.forEach(timer => {
                const row = `<tr> 
                    <td>${formatDate(timer.start_time) || ''}</td>
                    <td>${timer.end_time ? formatDate(timer.end_time) : "Still running" || ''}</td>
                    <td>${getDuration(timer.start_time, timer.end_time ? timer.end_time : '') || ''}</td>
                    <td><button class="description-toggle">Show Description</button></td>
                </tr>
                <tr class="details-row" style="display: none;">
                    <td colspan="4">
                        <div class="description-content">
                            ${timer.description || 'No description.'}
                        </div>
                    </td>
                </tr>
                </tr>`;
                tableBody.innerHTML += row;
            });
            updatePagination(data.total, page, limit);
        });
}

document.querySelector('#history-table tbody').addEventListener('click', function(e) {
    if (e.target.classList.contains('description-toggle')) {
        const detailsRow = e.target.closest('tr').nextElementSibling;
        if (detailsRow && detailsRow.classList.contains('details-row')) {
            detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
        }
    }
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadHistory(currentPage, limit);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    loadHistory(currentPage, limit);
});

function updatePagination(totalItems, currentPage, limit) {
    const totalPages = Math.ceil(totalItems / limit);

    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
    document.getElementById('current-page').textContent = `Page ${currentPage} of ${totalPages}`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadHistory(currentPage, limit);
});