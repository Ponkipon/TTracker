function hide(object) {
    object.innerHTML = '';
    object.className = '';
}

document.getElementById('login-form').onsubmit = function(event){
    event.preventDefault();
    loginHandler();
};

function loginHandler() {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            'username': document.getElementById('username-form').value,
            'password': document.getElementById('password-form').value
        })
    })
    .then(response => response.json())
    .then(data => {
        const notificationDiv = document.getElementById('notification');
        if (data.status === 'success') {
            notificationDiv.className = 'NotificationSuccess';
            notificationDiv.innerHTML = data.message;
            notificationDiv.addEventListener('click', () => hide(notificationDiv));
            location.replace('/dashboard');

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
        notificationDiv.innerHTML = 'An error occured while attempting to log in';
        notificationDiv.addEventListener('click', () => hide(notificationDiv));
    });
}