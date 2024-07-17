document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
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

    function displayFeedbackList(feedbacks) {
        feedbackList.innerHTML = '';
        feedbacks.forEach(feedback => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';
            feedbackItem.innerHTML = `
                <p><strong>Evaluation ID:</strong> ${feedback.evaluation_id}</p>
                <p><strong>Correct Score:</strong> ${feedback.correct_score}</p>
                <p><strong>Comment:</strong> ${feedback.comment}</p>
            `;
            feedbackList.appendChild(feedbackItem);
        });
    }

    // Load feedback list on page load
    loadFeedbackList();
});
