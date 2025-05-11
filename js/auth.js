/**
 * Authentication & Admin Functions
 * Handles user login/logout and admin functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if on login page
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Setup admin dropdown functionality
    setupAdminDropdown();
    
    // Check login status and show appropriate elements
    updateUIForLoginStatus();
    
    // Add event listener to admin link in dropdown
    setupAdminLink();
});

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('login-error');
    
    // Simple validation
    if (!emailInput || !passwordInput) return;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Check admin credentials (in a real app, this would be on the server)
    if (email === 'admin@tedouar.com' && password === 'admin123') {
        // Set login status in session storage
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminName', 'Admin');
        sessionStorage.setItem('adminEmail', email);
        
        // Show success message
        if (errorMessage) {
            errorMessage.textContent = 'Login successful! Redirecting...';
            errorMessage.style.color = '#28a745';
            errorMessage.style.display = 'block';
        }
        
        // Redirect to home page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        // Show error message
        if (errorMessage) {
            errorMessage.textContent = 'Invalid email or password. Please try again.';
            errorMessage.style.display = 'block';
        }
    }
}

/**
 * Setup admin dropdown menu functionality
 */
function setupAdminDropdown() {
    const dropdownToggle = document.getElementById('admin-dropdown-toggle');
    const dropdownMenu = document.getElementById('admin-dropdown-menu');
    
    if (dropdownToggle && dropdownMenu) {
        // Toggle dropdown on click
        dropdownToggle.addEventListener('click', function() {
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
        
        // Handle logout button
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove admin login status
                sessionStorage.removeItem('adminLoggedIn');
                sessionStorage.removeItem('adminName');
                sessionStorage.removeItem('adminEmail');
                
                // Reload page to update UI
                window.location.reload();
            });
        }
    }
}

/**
 * Setup admin link click handler
 */
function setupAdminLink() {
    const adminLinks = document.querySelectorAll('.admin-link');
    
    adminLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Do not prevent default here, allow navigation to the admin page
            
            // Check if admin is logged in
            const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
            
            if (!isLoggedIn) {
                e.preventDefault();
                alert('You must be logged in as an admin to access this page.');
                window.location.href = 'login.html';
            }
            
            // If admin is logged in, the link will work normally (navigate to admin/)
        });
    });
}

/**
 * Update UI elements based on login status
 */
function updateUIForLoginStatus() {
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const authButtons = document.getElementById('auth-buttons');
    const adminDropdown = document.getElementById('admin-dropdown');
    
    if (isAdminLoggedIn) {
        // Show admin dropdown
        if (authButtons) authButtons.style.display = 'none';
        if (adminDropdown) adminDropdown.style.display = 'block';
        
        // Update admin name in dropdown
        const adminName = sessionStorage.getItem('adminName') || 'Admin';
        const usernameElement = document.querySelector('.username');
        if (usernameElement) {
            usernameElement.textContent = adminName;
        }
    } else {
        // Show auth buttons
        if (authButtons) authButtons.style.display = 'flex';
        if (adminDropdown) adminDropdown.style.display = 'none';
    }
}
