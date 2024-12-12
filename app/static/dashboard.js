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

function updateElementWithAnimation(element, content) {
    element.classList.add('hidden'); 
    setTimeout(() => {
        element.innerHTML = content; 
        element.classList.remove('hidden'); 
    }, 300); 
}

// Logic behind start timer button, implemented in js to display a notification instead of new page load
// Response comes from timer.py route as a json
document.getElementById('timer-btn').addEventListener('click', () => {
    const action = document.getElementById('timer-btn').dataset.action;

    const description = {
        'description': document.getElementById('input').value
    }

    fetch(action === 'start' ? '/timer/start_timer' : '/timer/stop_timer', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(description)
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

const timerOff = 
`
<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="#000000"><path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg>
<span>Start Timer</span>
`;

const timerOn = 
`
<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="#000000"><path d="m798-274-60-60q11-27 16.5-53.5T760-440q0-116-82-198t-198-82q-24 0-51 5t-56 16l-60-60q38-20 80.5-30.5T480-800q60 0 117.5 20T706-722l56-56 56 56-56 56q38 51 58 108.5T840-440q0 42-10.5 83.5T798-274ZM520-552v-88h-80v8l80 80ZM792-56l-96-96q-48 35-103.5 53.5T480-80q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-60 18.5-115.5T192-656L56-792l56-56 736 736-56 56ZM480-160q42 0 82-13t75-37L248-599q-24 35-36 75t-12 84q0 116 82 198t198 82ZM360-840v-80h240v80H360Zm83 435Zm113-112Z"/></svg>
<span>Stop Timer</span>
`;

const showDesc = 
`
<div class="input-container">
    <input type="text" id="input" maxlength="255" required="">
    <label for="input" class="label">You can write down your progress here</label>
    <div class="underline"></div>
</div>
`;

const hideDesc = 
`
<div class="input-container" style="display: none;">
    <input type="text" id="input" maxlength="255" required="">
    <label for="input" class="label">You can write down your progress here</label>
    <div class="underline"></div>
</div>
`;

function fetchCurrentTimer() {
    fetch('/timer/current_timer')
    .then(response => response.json())
    .then(data => {
        const timerButton = document.getElementById('timer-btn');
        const timerStatus = document.getElementById('timer-status');
        const timerText = document.getElementById('current-timer');
        const durationText = document.getElementById('current-timer-duration');
        const descriptionBlock = document.querySelector('.progressTextHolder')
        if (data.status === 'success') {
            updateElementWithAnimation(timerStatus, "You have a running timer.");
            updateElementWithAnimation(timerText, "Timer started at: " + formatDate(data.start_time));
            updateElementWithAnimation(durationText, "Duration: " + getDuration(data.start_time));
            updateElementWithAnimation(timerButton, timerOn);
            updateElementWithAnimation(descriptionBlock, showDesc);
            timerButton.dataset.action = 'stop';
        } else {
            updateElementWithAnimation(timerStatus, "");
            updateElementWithAnimation(timerText, "You have no running timers");
            updateElementWithAnimation(durationText, "");
            updateElementWithAnimation(timerButton, timerOff);
            updateElementWithAnimation(descriptionBlock, hideDesc);
            timerButton.dataset.action = 'start';
        }
    })
    .catch(error => {
        console.error('Error: ', error);
        const timerText = document.getElementById('current-timer');
        const durationText = document.getElementById('current-timer-duration');
        updateElementWithAnimation(timerText, "An error occurred while retrieving current timer data");
        updateElementWithAnimation(durationText, "");
    });
};
fetchCurrentTimer();
