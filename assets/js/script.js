document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const updateUserForm = document.getElementById('updateUserForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const deleteUserForm = document.getElementById('deleteUserForm');
    const addCategoryForm = document.getElementById('addCategoryForm');
    const uploadFileForm = document.getElementById('uploadFile');
    const changeRoleForm = document.getElementById('changeRoleForm');
    const getMarkForm = document.getElementById('getMarkForm');
    const loadFeedbackButton = document.getElementById('loadFeedbackButton');
    const downloadFileButton = document.getElementById('downloadFileButton');
    const urlForm = document.getElementById('urlForm');
    const subscribedList = document.getElementById('subscribed');
    const notSubscribedList = document.getElementById('notSubscribed');
    const messageDiv = document.getElementById('message');

    // Add click event listener to logout button
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
            }, 2000); // Chờ 2 giây trước khi chuyển hướng
        } else {
            displayNotification(result.message || 'Registration failed', 'error');
        }
    });
}

function displayNotification(message, type) {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    notificationElement.style.display = 'block';
}
    /* role login*/
    /* const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        const { role } = userData;

        // Redirect based on user role
        if (role === 3) {
            window.location.href = 'admin.html'; // Redirect to admin page for role 3
        } else {
            // Redirect to default dashboard or user-specific page
            window.location.href = 'dashboard.html';
        }
    } else {
        // Handle case where user is not logged in or user data is not available
        window.location.href = 'login.html'; // Redirect to login page if not logged in
    } */
   
    /*login form*/
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!email || !password) {
                alert('Both email and password are required');
                return;
            }

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
                window.location.href = 'dashboard.html';
            } else {
                alert(result.message || 'Login failed');
            }
        });
    }
    /*info any page*/

    if (window.location.pathname.endsWith('dashboard.html')) {
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

    if (updateUserForm) {
        updateUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('updateEmail').value.trim();
            const fullName = document.getElementById('updateFullName').value.trim();
            const token = localStorage.getItem('token');

            if (!email || !fullName) {
                alert('Both email and full name are required');
                return;
            }

            if (!token) {
                alert('You need to login first.');
                window.location.href = 'login.html';
                return;
            }

            const response = await fetch('http://192.168.10.135:8080/api/auth/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, fullName })
            });

            const result = await response.json();
            if (response.ok) {
                alert('User information updated successfully');
                // Optional: Refresh profile information
                window.location.reload();
            } else {
                alert(result.message || 'Failed to update user information');
            }
        });
    }
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('changeEmail').value.trim();
            const oldPassword = document.getElementById('oldPassword').value.trim();
            const newPassword = document.getElementById('newPassword').value.trim();
            const token = localStorage.getItem('token');

            if (!email || !oldPassword || !newPassword) {
                alert('All fields are required');
                return;
            }

            if (!token) {
                alert('You need to login first.');
                window.location.href = 'login.html';
                return;
            }

            const response = await fetch('http://192.168.10.135:8080/api/auth/changePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, oldPassword, newPassword })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Password changed successfully');
            } else {
                alert(result.message || 'Failed to change password');
            }
        });
    }
    // Delete user
    if (deleteUserForm) {
        deleteUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('deleteEmail').value.trim();
            const token = localStorage.getItem('token');

            if (!email) {
                alert('Email is required');
                return;
            }

            if (!token) {
                alert('You need to login first.');
                window.location.href = 'login.html';
                return;
            }

            const confirmed = confirm(`Are you sure you want to delete the user with email: ${email}?`);
            if (!confirmed) {
                return;
            }

            const response = await fetch('http://192.168.10.135:8080/api/auth/deleteUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            if (response.ok) {
                alert('User deleted successfully');
                // Optional: Redirect to a different page or perform additional actions
            } else {
                alert(result.message || 'Failed to delete user');
            }
        });
    }
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const categoryName = document.getElementById('categoryName').value.trim();
            const token = localStorage.getItem('token');

            if (!categoryName) {
                alert('Category name is required');
                return;
            }

            if (!token) {
                alert('You need to login first.');
                window.location.href = 'login.html';
                return;
            }

            const url = 'http://192.168.10.135:8080/api/categories/addCate'; // Thay đổi URL nếu cần
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: categoryName })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Category added successfully');
                // Có thể làm mới danh sách danh mục hoặc thực hiện các hành động khác
            } else {
                alert(result.message || 'Failed to add category');
            }
        });
    }
    /*upload file*/
    if (uploadFileForm) {
        uploadFileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const token = localStorage.getItem('token');
            const criterionCode = document.getElementById('criterionCode').value.trim();
            const fileInput = document.getElementById('file');
            const file = fileInput.files[0];

            if (!criterionCode || !file) {
                alert('Both criterion code and file are required');
                return;
            }

            const formData = new FormData();
            formData.append('criterion_code', criterionCode);
            formData.append('file', file);

            try {
                const response = await fetch('http://192.168.10.135:8080/api/mark', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    document.getElementById('uploadMessage').textContent = 'File uploaded successfully';
                } else {
                    document.getElementById('uploadMessage').textContent = result.message || 'Upload failed';
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('uploadMessage').textContent = 'An error occurred';
            }
        });
    }

    /*change role*/
    if (changeRoleForm) {
        changeRoleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userId = document.getElementById('userId').value.trim();
            const newRole = document.getElementById('newRole').value.trim();

            if (!userId || !newRole) {
                alert('Both User ID and New Role are required');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                alert('No token found, please login first');
                return;
            }

            try {
                const response = await fetch('http://192.168.10.135:8080/api/auth/changeRole', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ userId, newRole })
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Role changed successfully');
                } else {
                    alert(result.message || 'Failed to change role');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while changing role');
            }
        });
    }
    /*get mark user*/
    if (getMarkForm) {
        getMarkForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userId = document.getElementById('userIdInput').value.trim();

            if (!userId) {
                alert('User ID is required');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                alert('No token found, please login first');
                return;
            }

            try {
                const response = await fetch(`http://192.168.10.135:8080/api/mark/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();
                if (response.ok) {
                    const markResults = document.getElementById('markResults');
                    markResults.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
                } else {
                    alert(result.message || 'Failed to get marks');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while getting marks');
            }
        });
    }
    if (downloadFileButton) {
        downloadFileButton.addEventListener('click', downloadFile);
    }

    async function downloadFile() {
        const userId = 123; // Replace with actual user ID
        const filename = 'example-file.pdf'; // Replace with actual filename

        const token = localStorage.getItem('token');
        if (!token) {
            displayNotification('Please log in to download files', 'error');
            return;
        }

        try {
            const response = await fetch(`http://192.168.10.135:8080/api/mark/download/${userId}/${filename}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create a link element and trigger a download
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            displayNotification('File download successful', 'success');
        } catch (error) {
            console.error('Error:', error);
            displayNotification('Failed to download file', 'error');
        }
    }
    /*sub url*/

if (urlForm) {
    urlForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const unitNameInput = document.getElementById('unitName').value.trim();
        const urlInput = document.getElementById('url').value.trim();
        const messageDiv = document.getElementById('message');

        if (!unitNameInput || !urlInput) {
            alert('Both unit name and URL are required');
            return;
        }

        const requestData = {
            url: urlInput,
            unitName: unitNameInput
        };

        console.log('Request Data:', requestData);  // Log dữ liệu yêu cầu

        try {
            const response = await fetch('http://192.168.10.135:8080/api/mark/url', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
            });

            console.log('Response Status:', response.status);  // Log mã trạng thái phản hồi

            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent = 'Gửi thành công!';
                messageDiv.style.color = 'green';
            } else {
                messageDiv.textContent = result.message || 'Submission failed';
                messageDiv.style.color = 'red';
                console.log('Error Message:', result.message);  // Log thông báo lỗi từ server
            }
        } catch (error) {
            console.error('Error:', error);  // Log lỗi chi tiết
            messageDiv.textContent = 'An error occurred';
            messageDiv.style.color = 'red';
        }
    });
}


    function displayNotification(message, type) {
        const notificationElement = document.getElementById('notification');
        notificationElement.textContent = message;
        notificationElement.className = `notification ${type}`;
        notificationElement.style.display = 'block';
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
                if (!isLoggedIn()) {
                    alert('You need to login first');
                    window.location.href = 'login.html';
                } else {
                    // Redirect to specified page only if logged in
                    window.location.href = redirectTo;
                }
            });
        }
    }

    // Redirect to login page if accessing protected pages directly
    redirectIfNotLoggedIn();


});

/*thống kê*/
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const subscribedList = document.getElementById('subscribed');
    const notSubscribedList = document.getElementById('notSubscribed');

    try {
        const response = await fetch('http://192.168.10.135:8080/api/mark/total_submit', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch subscriptions');
        }

        const data = await response.json();

        if (data.success) {
            data.subscribed.forEach(account => {
                const listItem = document.createElement('div');
                listItem.className = 'list-group-item subscribed';
                listItem.textContent = `${account.name} (${account.email})`;
                subscribedList.appendChild(listItem);
            });

            data.not_subscribed.forEach(account => {
                const listItem = document.createElement('div');
                listItem.className = 'list-group-item not-subscribed';
                listItem.textContent = `${account.name} (${account.email})`;
                notSubscribedList.appendChild(listItem);
            });
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('http://192.168.10.135:8080/api/mark/total_submit', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Response Data:', data);  // Log response data for debugging

            if (data.success) {
                const totalSubmitted = data.data.total_submit;
                const totalNotSubmitted = data.data.total_not_submit;

                // Call function to render chart
                renderChart(totalSubmitted, totalNotSubmitted);
                messageDiv.textContent = 'Data loaded successfully';
                messageDiv.style.color = 'green';
            } else {
                messageDiv.textContent = data.message || 'Failed to fetch data';
                messageDiv.style.color = 'red';
                console.error('Error Message:', data.message);
            }
        } else {
            const errorData = await response.json();
            messageDiv.textContent = errorData.message || 'Failed to fetch data';
            messageDiv.style.color = 'red';
            console.error('Error Message:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred';
        messageDiv.style.color = 'red';
    }
});

function renderChart(totalSubmitted, totalNotSubmitted) {
    const ctx = document.getElementById('submissionChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Submitted', 'Total Not Submitted'],
            datasets: [{
                label: 'Submissions',
                data: [totalSubmitted, totalNotSubmitted],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',  // Blue for Total Submitted
                    'rgba(255, 99, 132, 0.2)'   // Red for Total Not Submitted
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/*user sub*/
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const subscribedList = document.getElementById('subscribed');
    const notSubscribedList = document.getElementById('notSubscribed');
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('http://192.168.10.135:8080/api/mark/sub_and_notsub', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Response Data:', data);  // Log response data for debugging

            if (data.success) {
                // Clear existing list items
                subscribedList.innerHTML = '';
                notSubscribedList.innerHTML = '';

                // Populate subscribed list
                data.data.submitted.forEach(account => {
                    const listItem = document.createElement('div');
                    listItem.className = 'list-group-item';
                    listItem.textContent = `${account.full_name} (${account.email}) - Submitted on ${new Date(account.evaluation_date).toLocaleDateString()}`;
                    subscribedList.appendChild(listItem);
                });

                // Populate not subscribed list
                data.data.notSubmitted.forEach(account => {
                    const listItem = document.createElement('div');
                    listItem.className = 'list-group-item';
                    listItem.textContent = `${account.full_name} (${account.email}) - Not Submitted`;
                    notSubscribedList.appendChild(listItem);
                });

                messageDiv.textContent = 'Data loaded successfully';
                messageDiv.style.color = 'green';
            } else {
                messageDiv.textContent = data.message || 'Failed to fetch data';
                messageDiv.style.color = 'red';
                console.error('Error Message:', data.message);
            }
        } else {
            const errorData = await response.json();
            messageDiv.textContent = errorData.message || 'Failed to fetch data';
            messageDiv.style.color = 'red';
            console.error('Error Message:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred';
        messageDiv.style.color = 'red';
    }
});
/*get mark name*/
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const form = document.getElementById('searchForm');
    const fullnameInput = document.getElementById('fullname');
    const resultContainer = document.getElementById('searchResults');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullname = fullnameInput.value.trim();

        if (!fullname) {
            alert('Please enter a fullname');
            return;
        }

        try {
            const response = await fetch(`http://192.168.10.135:8080/api/mark/fullname/${encodeURIComponent(fullname)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Response Data:', data);  // Log response data for debugging

                if (data.success) {
                    // Remove duplicates
                    const uniqueResults = removeDuplicates(data.data, 'email');
                    // Sort by newest first
                    uniqueResults.sort((a, b) => new Date(b.evaluation_date) - new Date(a.evaluation_date));
                    renderSearchResults(uniqueResults);
                    messageDiv.textContent = 'Search results loaded successfully';
                    messageDiv.style.color = 'green';
                } else {
                    resultContainer.innerHTML = '';
                    messageDiv.textContent = data.message || 'No results found';
                    messageDiv.style.color = 'red';
                    console.error('Error Message:', data.message);
                }
            } else {
                const errorData = await response.json();
                resultContainer.innerHTML = '';
                messageDiv.textContent = errorData.message || 'Failed to fetch data';
                messageDiv.style.color = 'red';
                console.error('Error Message:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            resultContainer.innerHTML = '';
            messageDiv.textContent = 'An error occurred';
            messageDiv.style.color = 'red';
        }
    });

    function renderSearchResults(results) {
        resultContainer.innerHTML = '';

        results.forEach(result => {
            const listItem = document.createElement('div');
            listItem.className = 'list-group-item';
            listItem.textContent = `${result.full_name} (${result.email}) - ${result.submitted ? 'Chưa gửi' : 'Đã gửi'}`;
            resultContainer.appendChild(listItem);
        });
    }

    function removeDuplicates(array, key) {
        return array.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t[key] === item[key]
            ))
        );
    }
});


/*mark user*/

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const resultContainer = document.getElementById('submissionList');
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('http://192.168.10.135:8080/api/mark', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Response Data:', data);  // Log response data for debugging

            if (data.success) {
                renderSubmissions(data.data);
                messageDiv.textContent = 'Submissions loaded successfully';
                messageDiv.style.color = 'green';
            } else {
                resultContainer.innerHTML = '';
                messageDiv.textContent = data.message || 'No submissions found';
                messageDiv.style.color = 'red';
                console.error('Error Message:', data.message);
            }
        } else {
            const errorData = await response.json();
            resultContainer.innerHTML = '';
            messageDiv.textContent = errorData.message || 'Failed to fetch data';
            messageDiv.style.color = 'red';
            console.error('Error Message:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
        resultContainer.innerHTML = '';
        messageDiv.textContent = 'An error occurred';
        messageDiv.style.color = 'red';
    }
});

function renderSubmissions(submissions) {
    const resultContainer = document.getElementById('submissionList');
    resultContainer.innerHTML = '';

    submissions.forEach(submission => {
        const listItem = document.createElement('div');
        listItem.className = 'list-group-item';
        listItem.textContent = `${submission.full_name} (${submission.email}) - Submitted on ${new Date(submission.evaluation_date).toLocaleDateString()}`;
        
        // Add click event listener to view details
        listItem.addEventListener('click', async () => {
            try {
                const response = await fetch(`http://192.168.10.135:8080/api/mark/user/${submission.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    console.log('User Data:', userData);  // Log user data for debugging

                    if (userData.success && userData.data.length > 0) {
                        // Display user details in a modal or another section
                        displayUserDetails(userData.data);
                    } else {
                        alert(userData.message || 'No evaluations found for this user');
                        console.error('Error Message:', userData.message);
                    }
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Failed to fetch user details');
                    console.error('Error Message:', errorData.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while fetching user details');
            }
        });

        resultContainer.appendChild(listItem);
    });
}

function displayUserDetails(evaluations) {

    evaluations.forEach(evaluation => {
        alert(`Evaluation ID: ${evaluation.evaluation_id}\nCriterion Code: ${evaluation.criterion_code}\nIdea Score: ${evaluation.idea_score}\nBeginner Score: ${evaluation.beginner_score}\nFundamental Score: ${evaluation.fundamental_score}\nPerfect Score: ${evaluation.perfect_score}\nOptimize Score: ${evaluation.optimize_score}\nComment: ${evaluation.comment}\nCorrect Score: ${evaluation.correct_score}\nFeedback Date: ${evaluation.feedback_date}\nFile Name: ${evaluation.file_name}`);
    });
}



/*feedback*/
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No token found, please log in first.');
        return;
    }

    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackList = document.getElementById('feedbackList');
    const messageDiv = document.getElementById('message');

    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const evaluation_id = document.getElementById('evaluation_id').value;
        const correct_score = document.getElementById('correct_score').value;
        const comment = document.getElementById('comment').value;

        const feedbackData = {
            evaluation_id: parseInt(evaluation_id),
            correct_score: parseInt(correct_score),
            comment: comment
        };

        try {
            const response = await fetch('http://192.168.10.135:8080/api/feedback', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });

            if (response.ok) {
                const data = await response.json();
                messageDiv.textContent = 'Feedback submitted successfully';
                messageDiv.style.color = 'green';
                loadFeedbackList();
            } else {
                const errorData = await response.text(); // Đổi thành text để lấy dữ liệu lỗi HTML nếu có
                messageDiv.textContent = 'Error: ' + errorData;
                messageDiv.style.color = 'red';
                console.error('Response Error:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'An error occurred while submitting feedback';
            messageDiv.style.color = 'red';
        }
    });

    async function loadFeedbackList() {
        try {
            const response = await fetch('http://192.168.10.135:8080/api/feedback', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                displayFeedbackList(data.data);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                feedbackList.innerHTML = 'Failed to load feedback list';
            }
        } catch (error) {
            console.error('Error:', error);
            feedbackList.innerHTML = 'An error occurred while loading feedback list';
        }
    }

    function displayFeedbackList(feedbackData) {
        const submittedList = feedbackData.submitted;
        const notSubmittedList = feedbackData.notSubmitted;

        feedbackList.innerHTML = '';
        messageDiv.textContent = feedbackData.message || 'No feedback data found';
        messageDiv.style.color = feedbackData.success ? 'green' : 'red';

        if (submittedList.length > 0) {
            const submittedHeader = document.createElement('h2');
            submittedHeader.textContent = 'Submitted Feedbacks';
            feedbackList.appendChild(submittedHeader);

            submittedList.forEach(submission => {
                const submissionItem = document.createElement('div');
                submissionItem.className = 'submission-item';
                submissionItem.innerHTML = `
                    <p><strong>User ID:</strong> ${submission.user_id}</p>
                    <p><strong>Email:</strong> ${submission.email}</p>
                    <p><strong>Evaluation Date:</strong> ${new Date(submission.evaluation_date).toLocaleDateString()}</p>
                    <p><strong>Full Name:</strong> ${submission.full_name}</p>
                `;
                feedbackList.appendChild(submissionItem);
            });
        }

        if (notSubmittedList.length > 0) {
            const notSubmittedHeader = document.createElement('h2');
            notSubmittedHeader.textContent = 'Not Submitted Feedbacks';
            feedbackList.appendChild(notSubmittedHeader);

            notSubmittedList.forEach(user => {
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.innerHTML = `
                    <p><strong>User ID:</strong> ${user.user_id}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Full Name:</strong> ${user.full_name}</p>
                `;
                feedbackList.appendChild(userItem);
            });
        }
    }

    loadFeedbackList();
});


