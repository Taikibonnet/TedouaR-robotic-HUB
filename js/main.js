// TedouaR Robotics Hub - Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            authButtons.classList.toggle('mobile-active');
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    window.location.href = `encyclopedia.html?search=${encodeURIComponent(searchTerm)}`;
                }
            }
        });
    }
    
    // FAQ accordion on contact page
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.parentElement;
                const answer = faqItem.querySelector('.faq-answer');
                const icon = this.querySelector('.faq-icon i');
                
                // Toggle active class on the FAQ item
                faqItem.classList.toggle('active');
                
                // Toggle the icon between plus and minus
                if (icon.classList.contains('fa-plus')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
                
                // Toggle the display of the answer
                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }
    
    // Tabs functionality for robot detail page
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding content
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Initialize Google Map on contact page
    window.initMap = function() {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            // San Francisco coordinates (sample)
            const coordinates = { lat: 37.7749, lng: -122.4194 };
            
            const map = new google.maps.Map(mapContainer, {
                center: coordinates,
                zoom: 14,
                styles: [
                    // Custom dark map style - can be generated from snazzymaps.com
                    {
                        "featureType": "all",
                        "elementType": "labels.text.fill",
                        "stylers": [{"color": "#ffffff"}]
                    },
                    {
                        "featureType": "all",
                        "elementType": "labels.text.stroke",
                        "stylers": [{"color": "#000000"}, {"lightness": 13}]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry.fill",
                        "stylers": [{"color": "#000000"}]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry.stroke",
                        "stylers": [{"color": "#144b53"}, {"lightness": 14}, {"weight": 1.4}]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [{"color": "#08304b"}]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [{"color": "#0c4152"}, {"lightness": 5}]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.fill",
                        "stylers": [{"color": "#000000"}]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.stroke",
                        "stylers": [{"color": "#0b434f"}, {"lightness": 25}]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry.fill",
                        "stylers": [{"color": "#000000"}]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry.stroke",
                        "stylers": [{"color": "#0b3d51"}, {"lightness": 16}]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "geometry",
                        "stylers": [{"color": "#000000"}]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [{"color": "#146474"}]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [{"color": "#021019"}]
                    }
                ]
            });
            
            // Add marker for office location
            const marker = new google.maps.Marker({
                position: coordinates,
                map: map,
                title: 'TedouaR Robotics Hub',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#20e3b2',
                    fillOpacity: 1,
                    strokeColor: '#0cebeb',
                    strokeWeight: 2,
                    scale: 8
                }
            });
            
            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: '<div style="color:#121212;padding:5px;"><strong>TedouaR Robotics Hub</strong><br>123 Tech Boulevard, Innovation District<br>San Francisco, CA 94103</div>'
            });
            
            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });
        }
    };
    
    // Add admin authentication logic if on admin login page
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            
            // Check if credentials match the admin credentials
            if (email === 'tedouar.robotics@gmail.com' && password === 'Admin123!') {
                // Store the login state in session storage
                sessionStorage.setItem('adminLoggedIn', 'true');
                // Redirect to admin dashboard
                window.location.href = 'admin/dashboard.html';
            } else {
                // Show error message
                const errorMessage = document.getElementById('admin-login-error');
                if (errorMessage) {
                    errorMessage.textContent = 'Invalid email or password. Please try again.';
                    errorMessage.style.display = 'block';
                }
            }
        });
    }
    
    // Check for admin authentication on admin pages
    const adminPages = document.querySelector('.admin-container');
    if (adminPages) {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        if (!isLoggedIn) {
            // Redirect to login page if not authenticated
            window.location.href = '../login.html?redirect=admin';
        }
    }
});
