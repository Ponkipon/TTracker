const form = document.getElementById('add-user-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); 

        const formData = {
            'username': document.getElementById('username').value,
            'email': document.getElementById('email').value,
            'password': document.getElementById('password').value,
            'is_admin': document.getElementById('is_admin').checked 
        };

        fetch('/admin/manage-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(formData) 
        })
            .then(response => {
                if (!response.status === 'success') {
                    throw new Error('Server-side error');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message); 
                form.reset(); 
            })
            .catch(error => {
                console.error('problem with JS on the frontend: ', error);
                alert('Error adding user. Please try again.');
            });
    });