// Common Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Update the auth buttons based on login status
    const updateAuthUI = function() {
        const authButtonsContainer = document.querySelector('.auth-buttons');
        if (!authButtonsContainer) return;
        
        const userData = localStorage.getItem('tedouarUser');
        
        if (userData) {
            const user = JSON.parse(userData);
            
            if (user.isLoggedIn) {
                // User is logged in, show user dropdown instead of login/signup buttons
                authButtonsContainer.innerHTML = `
                    <div class="user-dropdown">
                        <div class="user-info" id="userDropdownToggle">
                            <span>${user.fullName || 'User'}</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="dropdown-menu" id="userDropdownMenu">
                            <a href="profile.html"><i class="fas fa-user"></i> Profile</a>
                            <a href="#"><i class="fas fa-cog"></i> Settings</a>
                            ${user.isAdmin ? '<a href="admin.html"><i class="fas fa-shield-alt"></i> Admin</a>' : ''}
                            <a href="#" id="logoutButton"><i class="fas fa-sign-out-alt"></i> Logout</a>
                        </div>
                    </div>
                `;
                
                // Add dropdown toggle functionality
                const userDropdownToggle = document.getElementById('userDropdownToggle');
                const userDropdownMenu = document.getElementById('userDropdownMenu');
                
                if (userDropdownToggle && userDropdownMenu) {
                    userDropdownToggle.addEventListener('click', function() {
                        userDropdownMenu.classList.toggle('active');
                    });
                    
                    // Close dropdown when clicking outside
                    document.addEventListener('click', function(event) {
                        if (!event.target.closest('.user-dropdown')) {
                            userDropdownMenu.classList.remove('active');
                        }
                    });
                }
                
                // Add logout functionality
                const logoutButton = document.getElementById('logoutButton');
                
                if (logoutButton) {
                    logoutButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        // Update user data
                        user.isLoggedIn = false;
                        localStorage.setItem('tedouarUser', JSON.stringify(user));
                        
                        // Redirect to home page
                        window.location.href = 'index.html';
                    });
                }
            } else {
                // User is logged out, show default buttons
                showDefaultAuthButtons(authButtonsContainer);
            }
        } else {
            // No user data, show default buttons
            showDefaultAuthButtons(authButtonsContainer);
        }
    };
    
    // Helper function to show default auth buttons
    const showDefaultAuthButtons = function(container) {
        // Get the current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        container.innerHTML = `
            <a href="login.html" class="btn btn-outline${currentPage === 'login.html' ? ' active' : ''}">Log In</a>
            <a href="signup.html" class="btn btn-primary${currentPage === 'signup.html' ? ' active' : ''}">Sign Up</a>
        `;
    };
    
    // Add user dropdown styles if not already in CSS
    const addUserDropdownStyles = function() {
        // Check if styles already exist
        if (document.querySelector('#user-dropdown-styles')) return;
        
        const styleEl = document.createElement('style');
        styleEl.id = 'user-dropdown-styles';
        styleEl.textContent = `
            /* User dropdown styles */
            .user-dropdown {
                position: relative;
            }
            
            .user-info {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                padding: 8px 16px;
                background-color: rgba(32, 227, 178, 0.1);
                border-radius: 5px;
                transition: all 0.3s;
                border: 1px solid rgba(32, 227, 178, 0.2);
            }
            
            .user-info:hover {
                background-color: rgba(32, 227, 178, 0.2);
            }
            
            .user-info span {
                font-weight: 500;
            }
            
            .user-info i {
                transition: transform 0.3s;
                font-size: 0.8rem;
            }
            
            .dropdown-menu {
                position: absolute;
                top: calc(100% + 5px);
                right: 0;
                width: 200px;
                background-color: rgba(25, 25, 25, 0.95);
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                overflow: hidden;
                display: none;
                z-index: 100;
                border: 1px solid rgba(32, 227, 178, 0.1);
            }
            
            .dropdown-menu.active {
                display: block;
            }
            
            .dropdown-menu a {
                display: block;
                padding: 12px 16px;
                color: var(--text-color);
                text-decoration: none;
                transition: all 0.2s;
            }
            
            .dropdown-menu a:hover {
                background-color: rgba(32, 227, 178, 0.1);
            }
            
            .dropdown-menu a i {
                margin-right: 8px;
                width: 18px;
                text-align: center;
            }
        `;
        
        document.head.appendChild(styleEl);
    };
    
    // Initialize
    addUserDropdownStyles();
    updateAuthUI();
    
    // Expose functions for other scripts to use
    window.tedouarAuth = {
        updateUI: updateAuthUI,
        getCurrentUser: function() {
            const userData = localStorage.getItem('tedouarUser');
            if (userData) {
                return JSON.parse(userData);
            }
            return null;
        },
        isLoggedIn: function() {
            const user = this.getCurrentUser();
            return user && user.isLoggedIn;
        },
        isAdmin: function() {
            const user = this.getCurrentUser();
            return user && user.isLoggedIn && user.isAdmin;
        },
        logout: function() {
            const userData = localStorage.getItem('tedouarUser');
            if (userData) {
                const user = JSON.parse(userData);
                user.isLoggedIn = false;
                localStorage.setItem('tedouarUser', JSON.stringify(user));
                updateAuthUI();
            }
        }
    };
});
