// profile.js - Handle profile page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the profile page
    const isProfilePage = document.querySelector('.profile-section');
    
    if (!isProfilePage) return;

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }

    // Load saved robots data
    loadSavedRobots();
    
    // Function to show notifications
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        // Hide notification after animation completes
        setTimeout(() => {
            notification.className = 'notification';
        }, 5000);
    }

    // Handle saved robots
    function loadSavedRobots() {
        const savedRobots = currentUser.savedRobots || [];
        const savedRobotsContainer = document.getElementById('saved-robots-container');
        const emptyState = document.getElementById('empty-state');
        
        // Update saved count
        document.getElementById('saved-count').textContent = savedRobots.length;
        
        // Show/hide empty state
        if (savedRobots.length === 0) {
            savedRobotsContainer.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        } else {
            savedRobotsContainer.style.display = 'grid';
            emptyState.style.display = 'none';
        }
        
        // Clear container
        savedRobotsContainer.innerHTML = '';
        
        // Add robots to container
        savedRobots.forEach(robotId => {
            const robot = window.robotsData[robotId];
            if (!robot) return;
            
            const robotElement = document.createElement('div');
            robotElement.className = 'saved-robot';
            robotElement.innerHTML = `
                <div class="saved-robot-img">
                    <img src="${robot.image}" alt="${robot.name}">
                </div>
                <div class="saved-robot-info">
                    <h3 class="saved-robot-name">${robot.name}</h3>
                    <p class="saved-robot-manufacturer">${robot.manufacturer}</p>
                    <div class="saved-robot-actions">
                        <a href="robot-detail.html?id=${robot.id}" class="saved-robot-btn view-btn">View Details</a>
                        <button class="saved-robot-btn remove-btn" data-robot-id="${robot.id}">Remove</button>
                    </div>
                </div>
            `;
            savedRobotsContainer.appendChild(robotElement);
        });
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const robotId = this.getAttribute('data-robot-id');
                removeFromSaved(robotId);
            });
        });
    }
    
    // Function to remove a robot from saved
    function removeFromSaved(robotId) {
        let savedRobots = currentUser.savedRobots || [];
        savedRobots = savedRobots.filter(id => id !== robotId);
        
        // Update current user
        currentUser.savedRobots = savedRobots;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        
        if (userIndex !== -1) {
            users[userIndex].savedRobots = savedRobots;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Show notification
        showNotification('Robot removed from your saved list', 'info');
        
        // Reload saved robots
        loadSavedRobots();
    }
});
