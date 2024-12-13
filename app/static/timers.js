import { formatDate } from "./base.js";
import { getDuration } from "./base.js";

var currentPage = 1;
var limit = 15;

function loadAdminTimers(filters = {}) {
    filters.page = currentPage;
    filters.limit = limit;

    const queryparams = new URLSearchParams(filters).toString();
    const url = `/admin/get_timers${queryparams ? '?' + queryparams : ''}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#admin-table tbody');
            tableBody.innerHTML = '';
            data.timers.forEach(timer => {
                const row = `<tr> 
                    <td class="first-column">${timer.user_id}</td>
                    <td>${timer.username}</td>
                    <td>${timer.email}</td>
                    <td>${formatDate(timer.start_time) || ''}</td>
                    <td>${formatDate(timer.end_time) || ''}</td>
                    <td>${getDuration(timer.start_time, timer.end_time) || ''}</td>
                    <td class="last-column"><button class="description-toggle">Show Description</button></td>
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
            updatePagination(data.total, currentPage, limit);
        });
}

function getCurrentFilters() {
    const username = document.getElementById('search-username').value;
    const email = document.getElementById('search-email').value;
    const startTime = document.getElementById('search-start-time').value;
    const endTime = document.getElementById('search-end-time').value;

    const filters = {};
    if (username) filters.username = username;
    if (email) filters.email = email;
    if (startTime) filters.start_time = startTime;
    if (endTime) filters.end_time = endTime;

    return filters;
}

document.querySelector('#admin-table tbody').addEventListener('click', function(e) {
    if (e.target.classList.contains('description-toggle')) {
        const detailsRow = e.target.closest('tr').nextElementSibling;
        if (detailsRow && detailsRow.classList.contains('details-row')) {
            detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
        }
    }
});

document.getElementById('search-button').addEventListener('click', () => {
    const filters = getCurrentFilters();
    currentPage = 1;
    loadAdminTimers(filters);
});



document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadAdminTimers(getCurrentFilters());
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    loadAdminTimers(getCurrentFilters());
});

function updatePagination(totalItems, currentPage, limit) {
    const totalPages = Math.ceil(totalItems / limit);

    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
    document.getElementById('current-page').textContent = `Page ${currentPage} of ${totalPages}`;
}



document.addEventListener('DOMContentLoaded', () => {
    loadAdminTimers();
});