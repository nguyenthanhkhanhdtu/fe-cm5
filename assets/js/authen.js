// File permission.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.querySelector('.logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token'); // Remove token from localStorage
            window.location.href = 'login.html'; // Redirect to the login page
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const phoneNumber = document.getElementById('phoneNumber').value.trim();

            if (!fullName || !email || !password || !confirmPassword || !phoneNumber) {
                displayNotification('All fields are required', 'error');
                return;
            }

            if (password !== confirmPassword) {
                displayNotification('Passwords do not match', 'error');
                return;
            }

            try {
                const response = await fetch('http://192.168.10.135:8080/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        full_name: fullName, 
                        email, 
                        password, 
                        confirm_password: confirmPassword, 
                        phone_number: phoneNumber 
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    displayNotification('Registration successful', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000); // Wait 2 seconds before redirecting
                } else {
                    displayNotification(result.message || 'Registration failed', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                displayNotification('Registration failed', 'error');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!email || !password) {
                alert('Both email and password are required');
                return;
            }

            try {
                const response = await fetch('http://192.168.10.135:8080/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', result.data.access_token);

                    // Check role_id and redirect accordingly
                    const token = localStorage.getItem('token');
                    const profileResponse = await fetch('http://192.168.10.135:8080/api/auth/profile', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const profileData = await profileResponse.json();
                    if (profileResponse.ok) {
                        const { role_id } = profileData.data;

                        if (role_id === 1) {
                            window.location.href = 'dashboard.html'; // Redirect to dashboard for role 1
                        } else if (role_id === 3) {
                            window.location.href = 'admin.html'; // Redirect to admin page for role 3
                        } else {
                            console.error('Invalid role_id:', role_id);
                            // Handle unauthorized access or unknown role_id
                        }
                    } else {
                        console.error('Failed to fetch profile data:', profileData.message);
                        alert('Login failed');
                    }
                } else {
                    alert(result.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed');
            }
        });
    }

    function displayNotification(message, type) {
        const notificationElement = document.getElementById('notification');
        notificationElement.textContent = message;
        notificationElement.className = `notification ${type}`;
        notificationElement.style.display = 'block';
    }

    // Info any page
    if (window.location.pathname.endsWith('dashboard.html') || window.location.pathname.endsWith('admin.html')) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
        } else {
            fetch('http://192.168.10.135:8080/api/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('userFullName').textContent = data.data.full_name;
                    document.getElementById('userEmail').textContent = data.data.email;
                    document.getElementById('userPhone').textContent = data.data.phone_number;
                } else {
                    alert(data.message);
                    window.location.href = 'login.html';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                window.location.href = 'login.html';
            });
        }
    }
     // Function to check if user is logged in
     function isLoggedIn() {
        const token = localStorage.getItem('token');
        return token !== null;
    }

    // Protect functions that require login
    protectFunction(updateUserForm, 'updateUser.html');
    protectFunction(changePasswordForm, 'changePassword.html');
    protectFunction(deleteUserForm, 'deleteUser.html');
    protectFunction(addCategoryForm, 'addCategory.html');
    protectFunction(uploadFileForm, 'uploadFile.html');
    protectFunction(changeRoleForm, 'changeRole.html');
    protectFunction(getMarkForm, 'getMark.html');
    protectFunction(feedbackForm, 'feedback.html');
    protectFunction(loadFeedbackButton, 'loadFeedback.html');
    protectFunction(downloadFileButton, ''); // Example: If no specific page needed, pass an empty string or handle accordingly

    // Function to protect functions that require login
    function protectFunction(element, redirectTo) {
        if (element) {
            element.addEventListener('click', () => {
                if (isLoggedIn()) {
                    window.location.href = redirectTo;
                } else {
                    alert('You need to login first');
                    window.location.href = 'login.html';
                }
            });
        }
    }
});
