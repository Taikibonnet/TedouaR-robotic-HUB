// Login Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('login-form');
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    const alertModal = document.getElementById('alertModal');
    const alertButton = document.getElementById('alertButton');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const alertIcon = document.getElementById('alertIcon');
    
    // Password toggle visibility
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Show alert modal
    const showAlert = function(title, message, icon, isSuccess = true) {
        if (alertTitle) alertTitle.textContent = title;
        if (alertMessage) alertMessage.textContent = message;
        
        if (alertIcon) {
            alertIcon.innerHTML = '';
            const iconElement = document.createElement('i');
            iconElement.className = `fas ${icon}`;
            alertIcon.appendChild(iconElement);
        }
        
        if (alertModal) {
            if (isSuccess) {
                alertModal.classList.remove('error');
                alertModal.classList.add('success');
            } else {
                alertModal.classList.remove('success');
                alertModal.classList.add('error');
            }
            alertModal.classList.add('active');
        }
    };
    
    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            if (!email.value || !password.value) {
                if (alertModal) {
                    showAlert('Error', 'Please fill in all fields', 'fa-exclamation-circle', false);
                } else {
                    alert('Please fill in all fields');
                }
                return;
            }
            
            // Demo login functionality
            // In a real application, you would send this data to a server for authentication
            if (email.value === 'admin@example.com' && password.value === 'password') {
                // Admin login
                const userData = {
                    fullName: 'Admin User',
                    email: email.value,
                    isAdmin: true,
                    isLoggedIn: true
                };
                
                // Store in localStorage
                localStorage.setItem('tedouarUser', JSON.stringify(userData));
                
                // Show success and redirect
                if (alertModal) {
                    showAlert('Success!', 'Login successful. Welcome back, Admin!', 'fa-check-circle');
                    // Redirect after closing the modal
                } else {
                    alert('Login successful! Welcome back, Admin!');
                    // Redirect immediately
                    window.location.href = 'index.html';
                }
            } 
            else if (email.value === 'user@example.com' && password.value === 'password') {
                // Regular user login
                const userData = {
                    fullName: 'Regular User',
                    email: email.value,
                    isAdmin: false,
                    isLoggedIn: true
                };
                
                // Store in localStorage
                localStorage.setItem('tedouarUser', JSON.stringify(userData));
                
                // Show success and redirect
                if (alertModal) {
                    showAlert('Success!', 'Login successful. Welcome back!', 'fa-check-circle');
                    // Redirect after closing the modal
                } else {
                    alert('Login successful! Welcome back!');
                    // Redirect immediately
                    window.location.href = 'index.html';
                }
            }
            // Check if user has registered previously
            else {
                const storedUser = localStorage.getItem('tedouarUser');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    if (userData.email === email.value && userData.passwordSet) {
                        // Update login status
                        userData.isLoggedIn = true;
                        localStorage.setItem('tedouarUser', JSON.stringify(userData));
                        
                        // Show success and redirect
                        if (alertModal) {
                            showAlert('Success!', 'Login successful. Welcome back!', 'fa-check-circle');
                            // Redirect after closing the modal
                        } else {
                            alert('Login successful! Welcome back!');
                            // Redirect immediately
                            window.location.href = 'index.html';
                        }
                        return;
                    }
                }
                
                // Invalid credentials
                if (alertModal) {
                    showAlert('Error', 'Invalid email or password. Please try again.', 'fa-exclamation-circle', false);
                } else {
                    alert('Invalid email or password. Please try again.');
                }
            }
        });
    }
    
    // Alert modal button
    if (alertButton) {
        alertButton.addEventListener('click', function() {
            alertModal.classList.remove('active');
            
            // If it was a successful login, redirect to home page
            if (alertModal.classList.contains('success')) {
                window.location.href = 'index.html';
            }
        });
    }
    
    // Check if user is already logged in
    const checkLoginStatus = function() {
        const userData = localStorage.getItem('tedouarUser');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.isLoggedIn) {
                // User is already logged in, redirect to home page
                // window.location.href = 'index.html';
                console.log("User already logged in:", user.fullName);
            }
        }
    };
    
    // Call the function to check login status
    // Commented out for development purposes
    // checkLoginStatus();
});
