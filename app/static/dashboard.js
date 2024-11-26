function hide(object) {
    object.innerHTML = '';
    object.className = '';
}

// Logic behind start timer button, implemented in js to display a notification instead of new page load
// Response comes from timer.py route as a json
document.getElementById('start-timer').addEventListener('click', () => {
    fetch('/timer/start_timer', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: {}
    })
    .then(response => response.json())
    .then(data => {
        const notificationDiv = document.getElementById('notification');
        if (data.status === 'success') {
            notificationDiv.className = 'NotificationSuccess';
            notificationDiv.innerHTML = data.message;
            notificationDiv.addEventListener('click', () => hide(notificationDiv));
        } else {
            notificationDiv.className = 'NotificationFail';
            notificationDiv.innerHTML = data.message;
            notificationDiv.addEventListener('click', () => hide(notificationDiv));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const notificationDiv = document.getElementById('notification');
        notificationDiv.className = 'NotificationFail';
        notificationDiv.innerHTML = 'An error occured while starting the timer';
        notificationDiv.addEventListener('click', () => hide(notificationDiv));
    });
});
// same thing but with da stop timer button
document.getElementById('stop-timer').addEventListener('click', () => {
    fetch('/timer/stop_timer', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: {}
    })
    .then(response => response.json())
    .then(data => {
        const notificationDiv = document.getElementById('notification');
        if (data.status === 'success') {
            notificationDiv.className = 'NotificationSuccess';
            notificationDiv.innerHTML = data.message;
            notificationDiv.addEventListener('click', () => hide(notificationDiv));
        } else {
            notificationDiv.className = 'NotificationFail';
            notificationDiv.innerHTML = data.message;
            notificationDiv.addEventListener('click', () => hide(notificationDiv));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const notificationDiv = document.getElementById('notification');
        notificationDiv.className = 'NotificationFail';
        notificationDiv.innerHTML = 'An error occured while starting the timer';
        notificationDiv.addEventListener('click', () => hide(notificationDiv));
    });
});