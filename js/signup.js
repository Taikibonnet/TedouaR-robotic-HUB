// Signup Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const signupForm = document.getElementById('signupForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const termsAgreement = document.getElementById('termsAgreement');
    const alertModal = document.getElementById('alertModal');
    const alertButton = document.getElementById('alertButton');
    
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
    
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPassword.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Password strength meter
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('strengthText');
    
    if (password) {
        password.addEventListener('input', function() {
            const value = password.value;
            let strength = 0;
            
            if (value.length >= 8) strength += 1;
            if (/[A-Z]/.test(value)) strength += 1;
            if (/[a-z]/.test(value)) strength += 1;
            if (/[0-9]/.test(value)) strength += 1;
            if (/[^A-Za-z0-9]/.test(value)) strength += 1;
            
            passwordStrength.className = 'strength-meter';
            
            if (strength === 0) {
                strengthText.textContent = '';
                passwordStrength.classList.remove('weak', 'medium', 'strong', 'very-strong');
            } else if (strength <= 2) {
                strengthText.textContent = 'Weak';
                passwordStrength.classList.add('weak');
            } else if (strength <= 3) {
                strengthText.textContent = 'Medium';
                passwordStrength.classList.add('medium');
            } else if (strength <= 4) {
                strengthText.textContent = 'Strong';
                passwordStrength.classList.add('strong');
            } else {
                strengthText.textContent = 'Very Strong';
                passwordStrength.classList.add('very-strong');
            }
        });
    }
    
    // Form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Reset error messages
            document.querySelectorAll('.error-message').forEach(el => {
                el.classList.remove('show-error');
            });
            
            // Validate full name
            if (fullName.value.trim() === '') {
                document.getElementById('fullNameError').classList.add('show-error');
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                document.getElementById('emailError').classList.add('show-error');
                isValid = false;
            }
            
            // Validate password
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            
            if (!passwordRegex.test(password.value)) {
                document.getElementById('passwordError').classList.add('show-error');
                isValid = false;
            }
            
            // Validate password confirmation
            if (password.value !== confirmPassword.value) {
                document.getElementById('confirmPasswordError').classList.add('show-error');
                isValid = false;
            }
            
            // Validate terms agreement
            if (!termsAgreement.checked) {
                document.getElementById('termsError').classList.add('show-error');
                isValid = false;
            }
            
            // If the form is valid, process it
            if (isValid) {
                // Get selected interests
                const interests = [];
                document.querySelectorAll('.interest-option input[type="checkbox"]:checked').forEach(el => {
                    interests.push(el.value);
                });
                
                // Create user object
                const userData = {
                    fullName: fullName.value,
                    email: email.value,
                    // Don't store password in local storage in a real application!
                    // This is just for demo purposes
                    passwordSet: true,
                    interests: interests,
                    isLoggedIn: true,
                    registrationDate: new Date().toISOString()
                };
                
                // In a real application, you would send this data to a server
                // For demo purposes, we'll store it in localStorage
                localStorage.setItem('tedouarUser', JSON.stringify(userData));
                
                // Show success modal
                alertModal.classList.add('active');
            }
        });
    }
    
    // Alert modal button
    if (alertButton) {
        alertButton.addEventListener('click', function() {
            alertModal.classList.remove('active');
            // Redirect to login page or homepage
            window.location.href = 'login.html';
        });
    }
    
    // Check if user is already logged in
    const checkLoginStatus = function() {
        const userData = localStorage.getItem('tedouarUser');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.isLoggedIn) {
                // Redirect to home page if already logged in
                // window.location.href = 'index.html';
                console.log("User already logged in:", user.fullName);
            }
        }
    };
    
    // Call the function to check login status
    // Commented out for development purposes
    // checkLoginStatus();
});
