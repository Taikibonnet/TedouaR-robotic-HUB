// robot-detail.js - Handle robot detail page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the robot detail page
    const isRobotDetailPage = document.querySelector('.robot-detail-container');
    
    if (!isRobotDetailPage) return;

    // Get robot ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const robotId = urlParams.get('id');
    
    if (!robotId || !window.robotsData[robotId]) {
        // Robot not found, redirect to encyclopedia
        window.location.href = 'encyclopedia.html';
        return;
    }
    
    // Get robot data
    const robot = window.robotsData[robotId];
    
    // Update page title
    document.title = `${robot.name} - TedouaR Robotics Hub`;
    
    // Set up save/unsave functionality
    setupSaveButton(robot);
    
    // Set up sharing functionality
    setupSharing(robot);
});

// Set up save/unsave button functionality
function setupSaveButton(robot) {
    const saveButton = document.getElementById('save-robot');
    if (!saveButton) return;
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // If not logged in, set up login redirect
    if (!currentUser) {
        saveButton.addEventListener('click', function() {
            // Store the robot ID to save after login
            localStorage.setItem('robotToSave', robot.id);
            // Redirect to login page
            window.location.href = 'login.html';
        });
        return;
    }
    
    // Check if the robot is already saved
    const savedRobots = currentUser.savedRobots || [];
    const isSaved = savedRobots.includes(robot.id);
    
    // Update button appearance based on saved status
    updateSaveButton(saveButton, isSaved);
    
    // Add click event to toggle saved status
    saveButton.addEventListener('click', function() {
        toggleSavedStatus(robot.id, saveButton);
    });
}

// Update save button appearance
function updateSaveButton(button, isSaved) {
    if (isSaved) {
        button.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
        button.classList.add('saved');
    } else {
        button.innerHTML = '<i class="far fa-bookmark"></i> Save';
        button.classList.remove('saved');
    }
}

// Toggle saved status of a robot
function toggleSavedStatus(robotId, button) {
    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get saved robots array
    let savedRobots = currentUser.savedRobots || [];
    
    // Check if robot is already saved
    const isSaved = savedRobots.includes(robotId);
    
    if (isSaved) {
        // Remove from saved
        savedRobots = savedRobots.filter(id => id !== robotId);
        showNotification('Robot removed from saved', 'info');
    } else {
        // Add to saved
        savedRobots.push(robotId);
        showNotification('Robot saved to your profile', 'success');
    }
    
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
    
    // Update button appearance
    updateSaveButton(button, !isSaved);
}

// Show a notification
function showNotification(message, type = 'success') {
    // Check if notification container exists
    let notification = document.querySelector('.notification');
    
    // Create notification if it doesn't exist
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.querySelector('.robot-detail-container').prepend(notification);
    }
    
    // Set notification content and style
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

// Set up sharing functionality
function setupSharing(robot) {
    const shareButtons = document.querySelectorAll('.share-button');
    
    if (!shareButtons.length) return;
    
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(`${robot.name} - TedouaR Robotics Hub`);
    
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const platform = button.getAttribute('data-platform');
            let shareUrl = '';
            
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${pageTitle}&body=Check out this robot: ${window.location.href}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Check if there's a robot to save after login
function checkRobotToSave() {
    const robotToSave = localStorage.getItem('robotToSave');
    
    if (robotToSave) {
        // Clear the stored robot ID
        localStorage.removeItem('robotToSave');
        
        // Save the robot
        toggleSavedStatus(robotToSave);
        
        // Show notification
        showNotification('Robot saved to your profile', 'success');
    }
}
