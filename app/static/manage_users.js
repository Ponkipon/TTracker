const form = document.getElementById('add-user-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const formData = {
            'username': document.getElementById('username').value,
            'email': document.getElementById('email').value,
            'password': document.getElementById('password').value,
            'is_admin': document.getElementById('is_admin').checked // Boolean value for checkbox
        };

        // Create a request object
        fetch('/admin/manage-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Specify JSON data type
            },
            body: JSON.stringify(formData) // Send JSON data
        })
            .then(response => {
                if (!response.status === 'success') {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message); // Notify the user
                form.reset(); // Clear the form
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                alert('Error adding user. Please try again.');
            });
    });