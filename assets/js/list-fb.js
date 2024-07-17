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

    // Load feedback list on page load
    loadFeedbackList();
});
