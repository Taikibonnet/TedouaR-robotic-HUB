// TedouaR Robotics Hub - Authentication Handler
document.addEventListener('DOMContentLoaded', function() {
    // Get the login and signup forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    if (passwordToggles.length > 0) {
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const passwordInput = this.previousElementSibling;
                const icon = this.querySelector('i');
                
                // Toggle password visibility
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
    
    // Password strength meter
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    
    if (passwordInput && strengthMeter && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Update strength meter
            const segments = strengthMeter.querySelectorAll('.strength-segment');
            
            // Reset all segments
            segments.forEach(segment => {
                segment.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
            
            // Update active segments based on password strength
            for (let i = 0; i < strength.score; i++) {
                segments[i].style.backgroundColor = getStrengthColor(strength.score);
            }
            
            // Update strength text
            strengthText.textContent = strength.message;
            strengthText.style.color = getStrengthColor(strength.score);
        });
    }
    
    // Calculate password strength (simple version)
    function calculatePasswordStrength(password) {
        let score = 0;
        let message = 'Password strength';
        
        if (password.length === 0) {
            return { score, message };
        }
        
        // Check length
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // Check for uppercase letters
        if (/[A-Z]/.test(password)) score++;
        
        // Check for lowercase letters
        if (/[a-z]/.test(password)) score++;
        
        // Check for numbers
        if (/[0-9]/.test(password)) score++;
        
        // Check for special characters
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        // Normalize score to max 4
        score = Math.min(score, 4);
        
        // Set message based on score
        switch (score) {
            case 1:
                message = 'Weak';
                break;
            case 2:
                message = 'Fair';
                break;
            case 3:
                message = 'Good';
                break;
            case 4:
                message = 'Strong';
                break;
            default:
                message = 'Password strength';
        }
        
        return { score, message };
    }
    
    // Get color based on password strength score
    function getStrengthColor(score) {
        switch (score) {
            case 1:
                return '#f44336'; // Red
            case 2:
                return '#ff9800'; // Orange
            case 3:
                return '#2196f3'; // Blue
            case 4:
                return '#4caf50'; // Green
            default:
                return 'rgba(255, 255, 255, 0.5)';
        }
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form input values
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember') ? document.getElementById('remember').checked : false;
            
            // Simple validation
            if (!email || !password) {
                showNotification('Please enter both email and password.', 'error');
                return;
            }
            
            // Email validation using a simple regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';
            
            // Check if it's the admin login
            if (email === 'tedouar.robotics@gmail.com' && password === 'Admin123!') {
                // For admin login, store in session storage
                sessionStorage.setItem('adminLoggedIn', 'true');
                
                // Redirect to admin dashboard
                setTimeout(function() {
                    window.location.href = 'admin/dashboard.html';
                }, 1000);
                
                return;
            }
            
            // In a real application, you would send the login data to your server
            // For this demo, we'll simulate a login success after a delay
            
            setTimeout(function() {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                // Simulate successful login
                // In a real application, this would check credentials with the server
                
                // Store login state
                if (remember) {
                    localStorage.setItem('userLoggedIn', 'true');
                    localStorage.setItem('userEmail', email);
                } else {
                    sessionStorage.setItem('userLoggedIn', 'true');
                    sessionStorage.setItem('userEmail', email);
                }
                
                // Show success message
                showNotification('Login successful!', 'success');
                
                // Redirect to homepage after a short delay
                setTimeout(function() {
                    // Check if there's a redirect parameter in the URL
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect');
                    
                    if (redirect === 'admin') {
                        window.location.href = 'admin/dashboard.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1000);
            }, 1500);
        });
    }
    
    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form input values
            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAgreed = document.getElementById('terms').checked;
            
            // Simple validation
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showNotification('Please fill out all fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Password strength validation
            const strength = calculatePasswordStrength(password);
            if (strength.score < 3) {
                showNotification('Please create a stronger password.', 'error');
                return;
            }
            
            // Password matching validation
            if (password !== confirmPassword) {
                showNotification('Passwords do not match.', 'error');
                return;
            }
            
            // Terms agreement validation
            if (!termsAgreed) {
                showNotification('You must agree to the Terms of Service and Privacy Policy.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = signupForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Creating account...';
            
            // In a real application, you would send the signup data to your server
            // For this demo, we'll simulate a successful signup after a delay
            
            setTimeout(function() {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                // Simulate successful signup
                // In a real application, this would register the user on the server
                
                // Store login state
                sessionStorage.setItem('userLoggedIn', 'true');
                sessionStorage.setItem('userEmail', email);
                sessionStorage.setItem('userName', `${firstName} ${lastName}`);
                
                // Show success message
                showNotification('Account created successfully!', 'success');
                
                // Redirect to homepage after a short delay
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 1000);
            }, 1500);
        });
    }
    
    // Function to display notification
    function showNotification(message, type) {
        // Check if notification container exists, create if not
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add close button
        const closeButton = document.createElement('span');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', function() {
            notification.remove();
        });
        notification.appendChild(closeButton);
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            notification.remove();
        }, 5000);
    }
    
    // Check login status on page load
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true' || sessionStorage.getItem('userLoggedIn') === 'true';
        
        // Get user info elements
        const userInfoElements = document.querySelectorAll('.user-info');
        const authButtons = document.querySelectorAll('.auth-buttons');
        
        if (isLoggedIn) {
            // Get user details
            const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
            const userName = localStorage.getItem('userName') || sessionStorage.getItem('userName') || userEmail.split('@')[0];
            
            // Update user info elements if they exist
            userInfoElements.forEach(element => {
                element.style.display = 'flex';
                
                // Try to get the username element
                const usernameElement = element.querySelector('.user-name');
                if (usernameElement) {
                    usernameElement.textContent = userName;
                }
            });
            
            // Hide auth buttons if they exist
            authButtons.forEach(element => {
                element.style.display = 'none';
            });
            
            // Add logout button to header if not already present
            const header = document.querySelector('.header-container');
            if (header && !document.querySelector('.logout-btn')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.className = 'btn btn-outline logout-btn';
                logoutBtn.textContent = 'Log Out';
                
                // Add logout functionality
                logoutBtn.addEventListener('click', function() {
                    // Clear login data
                    localStorage.removeItem('userLoggedIn');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    sessionStorage.removeItem('userLoggedIn');
                    sessionStorage.removeItem('userEmail');
                    sessionStorage.removeItem('userName');
                    sessionStorage.removeItem('adminLoggedIn');
                    
                    // Reload the page
                    window.location.reload();
                });
                
                header.appendChild(logoutBtn);
            }
        } else {
            // Hide user info elements if they exist
            userInfoElements.forEach(element => {
                element.style.display = 'none';
            });
            
            // Show auth buttons if they exist
            authButtons.forEach(element => {
                element.style.display = 'flex';
            });
        }
    }
    
    // Check login status on page load
    checkLoginStatus();
});

// Add CSS for notifications
document.addEventListener('DOMContentLoaded', function() {
    // Create a style element
    const style = document.createElement('style');
    
    // Define notification styles
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .notification {
            min-width: 300px;
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out forwards;
            position: relative;
            padding-right: 35px;
        }
        
        .notification.success {
            background-color: #4caf50;
        }
        
        .notification.error {
            background-color: #f44336;
        }
        
        .notification.info {
            background-color: #2196f3;
        }
        
        .notification-close {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            font-size: 20px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        /* Form styling */
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .remember-me {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .forgot-password {
            color: var(--primary);
            font-size: 0.9rem;
        }
        
        .forgot-password:hover {
            text-decoration: underline;
        }
        
        .btn-block {
            width: 100%;
            text-align: center;
        }
        
        .password-input {
            position: relative;
        }
        
        .password-toggle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--gray);
            cursor: pointer;
        }
        
        .password-strength {
            margin-top: 8px;
            font-size: 0.8rem;
        }
        
        .strength-meter {
            display: flex;
            gap: 5px;
            margin-bottom: 5px;
        }
        
        .strength-segment {
            height: 4px;
            flex: 1;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
        }
        
        .form-checkbox {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .form-checkbox input[type="checkbox"] {
            width: 18px;
            height: 18px;
        }
        
        .form-checkbox label {
            font-size: 0.9rem;
        }
        
        .form-checkbox a {
            color: var(--primary);
        }
        
        .form-checkbox a:hover {
            text-decoration: underline;
        }
        
        .logout-btn {
            margin-left: 15px;
        }
    `;
    
    // Append style to head
    document.head.appendChild(style);
});
