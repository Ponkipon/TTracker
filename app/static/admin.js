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
                    <td>${timer.start_time || ''}</td>
                    <td>${timer.end_time || ''}</td>
                    <td>${timer.duration || ''}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        });
}
loadAdminTimers();