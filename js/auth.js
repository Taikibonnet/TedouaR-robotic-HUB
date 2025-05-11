// Common Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // For demonstration/testing purposes - simulate admin login
    // In production, this would be handled via proper authentication
    if (window.location.pathname.includes('login.html')) {
        const loginForm = document.querySelector('form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');
                
                if (emailInput && passwordInput) {
                    const email = emailInput.value.trim();
                    const password = passwordInput.value;
                    
                    // Check if admin credentials (for demo only)
                    // In a real app, this would be verified on the server
                    if (email === 'admin@tedouar.com' && password === 'admin123') {
                        // Set admin session
                        sessionStorage.setItem('adminLoggedIn', 'true');
                        
                        // Redirect to admin dashboard or homepage
                        const redirect = new URLSearchParams(window.location.search).get('redirect');
                        if (redirect === 'admin') {
                            window.location.href = 'admin/';
                        } else {
                            window.location.href = 'index.html';
                        }
                    } else {
                        // Show error message for wrong credentials
                        const errorMessage = document.querySelector('.error-message');
                        if (errorMessage) {
                            errorMessage.textContent = 'Invalid email or password.';
                            errorMessage.style.display = 'block';
                        } else {
                            // Create error message if it doesn't exist
                            const messageDiv = document.createElement('div');
                            messageDiv.className = 'error-message';
                            messageDiv.textContent = 'Invalid email or password.';
                            messageDiv.style.color = '#ff6b6b';
                            messageDiv.style.marginTop = '10px';
                            loginForm.appendChild(messageDiv);
                        }
                    }
                }
            });
        }
    }
    
    // Update the auth buttons based on login status
    const updateAuthUI = function() {
        const authButtonsContainer = document.getElementById('auth-buttons');
        const adminDropdown = document.getElementById('admin-dropdown');
        
        if (!authButtonsContainer && !adminDropdown) return;
        
        const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        
        if (isAdminLoggedIn) {
            // Admin is logged in
            if (authButtonsContainer) authButtonsContainer.style.display = 'none';
            if (adminDropdown) adminDropdown.style.display = 'block';
        } else {
            // Admin is not logged in
            if (authButtonsContainer) authButtonsContainer.style.display = 'flex';
            if (adminDropdown) adminDropdown.style.display = 'none';
        }
    };
    
    // Handle logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear admin session
            sessionStorage.removeItem('adminLoggedIn');
            
            // Redirect to homepage
            window.location.href = 'index.html';
        });
    }
    
    // Initialize
    updateAuthUI();
    
    // Expose functions for other scripts to use
    window.tedouarAuth = {
        updateUI: updateAuthUI,
        isAdminLoggedIn: function() {
            return sessionStorage.getItem('adminLoggedIn') === 'true';
        },
        adminLogout: function() {
            sessionStorage.removeItem('adminLoggedIn');
            updateAuthUI();
        }
    };
});