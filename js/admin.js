/**
 * Admin Authentication Functions for TedouaR Robotics Hub
 * This file handles admin login, logout, and session management
 */

// Default admin credentials (for demo purposes)
const DEFAULT_ADMIN = {
    email: "admin@tedouar.com",
    password: "admin123"
};

/**
 * Validate admin login credentials
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {boolean} - Whether the credentials are valid
 */
function validateAdminCredentials(email, password) {
    // Simple validation against default credentials
    return (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password);
}

/**
 * Set the admin login state in localStorage
 * @param {boolean} remember - Whether to "remember" the login state
 */
function setAdminLoginState(remember = false) {
    const loginData = {
        loggedIn: true,
        timestamp: new Date().getTime(),
        remember: remember
    };
    
    localStorage.setItem('admin_logged_in', JSON.stringify(loginData));
}

/**
 * Check if admin is currently logged in
 * @returns {boolean} - Whether the admin is logged in
 */
function validateLoginState() {
    // Get login data from localStorage
    const loginData = JSON.parse(localStorage.getItem('admin_logged_in'));
    
    // If no login data exists, user is not logged in
    if (!loginData) {
        return false;
    }
    
    // Check if user is logged in
    if (!loginData.loggedIn) {
        return false;
    }
    
    // Check if login has expired (24 hours if not remembered)
    const currentTime = new Date().getTime();
    const loginTime = loginData.timestamp;
    const timeDiff = currentTime - loginTime;
    
    // 24 hours in milliseconds = 86400000
    // If remember is false and more than 24 hours have passed, login has expired
    if (!loginData.remember && timeDiff > 86400000) {
        logoutAdmin(); // Clear expired login
        return false;
    }
    
    return true;
}

/**
 * Log out the admin user
 */
function logoutAdmin() {
    localStorage.removeItem('admin_logged_in');
}

/**
 * Save robots data to localStorage
 * @param {Array} robots - Array of robot objects
 */
function saveRobots(robots) {
    localStorage.setItem('robots', JSON.stringify(robots));
}

/**
 * Load robots data from localStorage
 * @returns {Array} - Array of robot objects
 */
function loadRobotsForAdmin() {
    return JSON.parse(localStorage.getItem('robots')) || [];
}

/**
 * Delete robot by ID
 * @param {string} robotId - ID of the robot to delete
 * @returns {Object} - Result of the operation
 */
function deleteRobot(robotId) {
    const robots = loadRobotsForAdmin();
    const index = robots.findIndex(robot => robot.slug === robotId);
    
    if (index === -1) {
        return {
            success: false,
            message: 'Robot not found'
        };
    }
    
    robots.splice(index, 1);
    saveRobots(robots);
    
    return {
        success: true
    };
}

// Handle login form submission if on the login page
document.addEventListener('DOMContentLoaded', function() {
    // Check if on login page
    const loginForm = document.getElementById('admin-login-form');
    
    if (loginForm) {
        // If already logged in, redirect to admin panel
        if (validateLoginState()) {
            window.location.href = 'admin-panel.html';
            return;
        }
        
        // Add form submission handler
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            const remember = document.getElementById('admin-remember')?.checked || false;
            
            if (validateAdminCredentials(email, password)) {
                setAdminLoginState(remember);
                window.location.href = 'admin-panel.html';
            } else {
                alert('Invalid email or password. Please try again.');
            }
        });
    }
    
    // Check if on admin page (not login page)
    if (window.location.pathname.includes('admin-') && !window.location.pathname.includes('admin-login.html')) {
        // If not logged in, redirect to login page
        if (!validateLoginState()) {
            window.location.href = 'admin-login.html';
            return;
        }
        
        // Setup logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                logoutAdmin();
                window.location.href = 'admin-login.html';
            });
        }
    }
});
