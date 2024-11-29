function formatDate(date){
    const dateObject = new Date(date);
    const formattedDate = dateObject.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = dateObject.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${formattedDate}, ${formattedTime}`
}
// shamelessly copied function from chatgpt to calculate duration with dynamic formatting
function getDuration(date) {
    const timerStartTime = new Date(date);
    const currentTime = new Date();

    // Get the difference in milliseconds
    const durationMs = currentTime.getTime() - timerStartTime.getTime();

    // Calculate precise components
    const totalMinutes = Math.floor(durationMs / (1000 * 60));
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60) % 24;
    const days = Math.floor(totalMinutes / (60 * 24));

    // Build the result string dynamically
    let result = [];
    if (days > 0) result.push(`${days} ${days === 1 ? "day" : "days"}`);
    if (totalHours > 0 || days > 0) result.push(`${totalHours} ${totalHours === 1 ? "hour" : "hours"}`);
    if (minutes > 0 || result.length === 0) result.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);

    return `${result.join(", ")}`;
}

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
            fetchCurrentTimer();
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
            fetchCurrentTimer();
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

function fetchCurrentTimer() {
    fetch('/timer/current_timer')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const timerText = document.getElementById('current-timer');
            timerText.innerHTML = "Timer started at: " + formatDate(data.start_time);
            const durationText = document.getElementById('current-timer-duration');
            durationText.innerHTML = "Duration: " + getDuration(data.start_time);
        } else {
            const timerText = document.getElementById('current-timer');
            timerText.innerHTML = "You have no running timers";
            const durationText = document.getElementById('current-timer-duration');
            durationText.innerHTML = "";
        }
        
    })
    .catch(error => {
        console.error('Error: ', error)
        const timerText = document.getElementById('current-timer');
        timerText.innerHTML = "An error occured while retrieving current timer data";
        const durationText = document.getElementById('current-timer-duration');
        durationText.innerHTML = "";
    });
};
fetchCurrentTimer();
