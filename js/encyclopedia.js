// TedouaR Robotics Hub - Encyclopedia JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get the robot cards and category tags
    const robotCards = document.querySelectorAll('.robot-card');
    const categoryTags = document.querySelectorAll('.category-tag');
    const searchInput = document.getElementById('encyclopedia-search');
    const robotGrid = document.getElementById('robot-grid');
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    
    // Check if we're on the encyclopedia page
    if (robotCards.length > 0 && categoryTags.length > 0 && robotGrid) {
        // Initial setup - check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        const searchParam = urlParams.get('search');
        
        // If a category is specified in the URL, filter by that category
        if (categoryParam) {
            categoryTags.forEach(tag => {
                if (tag.getAttribute('data-category') === categoryParam) {
                    tag.click(); // Trigger click on the appropriate category tag
                }
            });
        }
        
        // If a search term is specified in the URL, perform the search
        if (searchParam && searchInput) {
            searchInput.value = searchParam;
            filterRobots(searchParam);
        }
        
        // Add event listeners to category tags
        categoryTags.forEach(tag => {
            tag.addEventListener('click', function() {
                // Remove active class from all tags
                categoryTags.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tag
                this.classList.add('active');
                
                // Get the category value
                const category = this.getAttribute('data-category');
                
                // Filter the robot cards
                if (category === 'all') {
                    // Show all robots
                    robotCards.forEach(card => {
                        card.style.display = 'block';
                    });
                } else {
                    // Filter by category
                    robotCards.forEach(card => {
                        const categories = card.getAttribute('data-categories');
                        if (categories.includes(category)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
                
                // Reset pagination to first page
                resetPagination();
            });
        });
        
        // Add event listener to search input
        if (searchInput) {
            searchInput.addEventListener('keyup', function() {
                const searchTerm = this.value.trim().toLowerCase();
                
                // If search term is empty, show all robots for the currently selected category
                if (searchTerm === '') {
                    const activeCategory = document.querySelector('.category-tag.active').getAttribute('data-category');
                    
                    if (activeCategory === 'all') {
                        // Show all robots
                        robotCards.forEach(card => {
                            card.style.display = 'block';
                        });
                    } else {
                        // Filter by active category
                        robotCards.forEach(card => {
                            const categories = card.getAttribute('data-categories');
                            if (categories.includes(activeCategory)) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    }
                } else {
                    // Filter robots by search term
                    filterRobots(searchTerm);
                }
                
                // Reset pagination to first page
                resetPagination();
            });
        }
        
        // Function to filter robots by search term
        function filterRobots(searchTerm) {
            searchTerm = searchTerm.toLowerCase();
            
            robotCards.forEach(card => {
                const robotName = card.querySelector('.robot-title').textContent.toLowerCase();
                const robotDesc = card.querySelector('.robot-desc').textContent.toLowerCase();
                const robotMeta = card.querySelector('.robot-meta').textContent.toLowerCase();
                
                if (robotName.includes(searchTerm) || 
                    robotDesc.includes(searchTerm) || 
                    robotMeta.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        // Pagination functionality
        if (paginationButtons.length > 0) {
            const itemsPerPage = 12; // Number of robots to show per page
            let currentPage = 1;
            
            // Function to show items for the current page
            function showPage(page) {
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                
                // Get visible cards based on current filters
                const visibleCards = Array.from(robotCards).filter(card => 
                    card.style.display !== 'none'
                );
                
                // Hide all cards first
                visibleCards.forEach(card => {
                    card.classList.add('hidden');
                });
                
                // Show only the cards for the current page
                for (let i = startIndex; i < endIndex && i < visibleCards.length; i++) {
                    visibleCards[i].classList.remove('hidden');
                }
                
                // Update pagination buttons
                updatePaginationButtons(visibleCards.length);
            }
            
            // Function to update pagination buttons
            function updatePaginationButtons(totalItems) {
                // Calculate total pages
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                
                // Hide all page buttons first
                paginationButtons.forEach(btn => {
                    if (!btn.classList.contains('next')) {
                        btn.style.display = 'none';
                    }
                });
                
                // Show buttons for available pages (max 3)
                for (let i = 0; i < Math.min(3, totalPages); i++) {
                    const pageBtn = paginationButtons[i];
                    pageBtn.style.display = 'block';
                    pageBtn.textContent = i + 1;
                    pageBtn.classList.toggle('active', i + 1 === currentPage);
                }
                
                // Hide next button if we're on the last page or if there's only one page
                const nextBtn = document.querySelector('.pagination-btn.next');
                if (nextBtn) {
                    nextBtn.style.display = currentPage >= totalPages || totalPages <= 1 ? 'none' : 'block';
                }
            }
            
            // Reset pagination to first page
            function resetPagination() {
                currentPage = 1;
                showPage(currentPage);
            }
            
            // Add event listeners to pagination buttons
            paginationButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    if (this.classList.contains('next')) {
                        // Next button
                        currentPage++;
                    } else {
                        // Numbered button
                        currentPage = parseInt(this.textContent);
                    }
                    
                    showPage(currentPage);
                    
                    // Scroll to top of the robot grid
                    robotGrid.scrollIntoView({ behavior: 'smooth' });
                });
            });
            
            // Initialize pagination
            showPage(currentPage);
        }
    }
    
    // Robot Detail Page - Get robot info from URL parameter
    const isRobotDetailPage = window.location.pathname.includes('robot-detail.html');
    if (isRobotDetailPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const robotId = urlParams.get('id');
        
        if (robotId) {
            // Fetch robot details from the server or use predefined data
            fetchRobotDetails(robotId);
        }
    }
    
    // Function to fetch robot details (placeholder - would be replaced with actual API call)
    function fetchRobotDetails(robotId) {
        // This is a placeholder for an actual API call
        // In a real implementation, this would fetch data from your backend
        console.log(`Fetching details for robot: ${robotId}`);
        
        // Sample data for demonstration
        const robotData = {
            spot: {
                name: 'Spot',
                manufacturer: 'Boston Dynamics',
                categories: ['Industrial', 'Quadruped', 'Autonomous'],
                description: 'Spot is an agile mobile robot that navigates terrain with unprecedented mobility, allowing you to automate routine inspection tasks and data capture safely, accurately, and frequently.',
                details: 'Spot is designed to go where wheeled robots cannot, while carrying payloads with endurance far beyond aerial drones. With 360° vision and obstacle avoidance, Spot can be driven remotely or taught routes to follow autonomously.',
                specs: {
                    height: '0.84 m',
                    width: '0.43 m',
                    length: '1.1 m',
                    weight: '32.5 kg',
                    runtime: '90 minutes',
                    maxSpeed: '1.6 m/s',
                    dof: '12',
                    maxIncline: '30 degrees'
                },
                applications: [
                    'Industrial Inspection',
                    'Construction Monitoring',
                    'Public Safety',
                    'Entertainment'
                ]
            },
            atlas: {
                name: 'Atlas',
                manufacturer: 'Boston Dynamics',
                categories: ['Humanoid', 'Research'],
                description: 'Atlas is the most dynamic humanoid robot in the world, designed to navigate rough terrain and perform complex physical tasks.',
                details: 'Atlas uses its whole body, including legs, arms, and torso, to perform tasks, just like a human would. It can manipulate the world by using its hands to lift, carry, and toss heavy objects. Atlas has one of the world\'s most compact mobile hydraulic systems.',
                specs: {
                    height: '1.5 m',
                    width: '0.61 m',
                    weight: '89 kg',
                    dof: '28',
                    power: 'Electric and hydraulic',
                    sensorSuite: 'Depth cameras, IMU, proprioception'
                },
                applications: [
                    'Research',
                    'Disaster Response',
                    'Search and Rescue',
                    'Military Applications'
                ]
            }
            // Additional robots would be defined here
        };
        
        // If robot exists in our sample data, update the page
        if (robotData[robotId]) {
            updateRobotDetailPage(robotData[robotId]);
        } else {
            // Handle the case when robot is not found
            document.querySelector('.robot-title-large').textContent = 'Robot Not Found';
            document.querySelector('.robot-summary-large').textContent = 'The requested robot information could not be found.';
        }
    }
    
    // Function to update the robot detail page with fetched data
    function updateRobotDetailPage(robotData) {
        // Update main information
        document.querySelector('.robot-title-large').textContent = robotData.name;
        document.querySelector('.robot-manufacturer-large').textContent = robotData.manufacturer;
        document.querySelector('.robot-summary-large').textContent = robotData.description;
        
        // Update categories
        const categoriesContainer = document.querySelector('.robot-categories-large');
        categoriesContainer.innerHTML = ''; // Clear existing categories
        
        robotData.categories.forEach(category => {
            const categorySpan = document.createElement('span');
            categorySpan.className = 'robot-category-large';
            categorySpan.textContent = category;
            categoriesContainer.appendChild(categorySpan);
        });
        
        // Update Overview tab content
        const overviewContent = document.querySelector('#overview .overview-text');
        if (overviewContent) {
            overviewContent.innerHTML = `
                <p>${robotData.description}</p>
                <p>${robotData.details}</p>
            `;
        }
        
        // Update Specifications tab content
        const specsContent = document.querySelector('#specs .specs-grid');
        if (specsContent && robotData.specs) {
            let specsHTML = '';
            
            // Group 1 - Physical specs
            specsHTML += '<div><div class="spec-group"><h3 class="spec-title">Physical</h3>';
            
            if (robotData.specs.height) {
                specsHTML += `
                    <div class="spec-item">
                        <div class="spec-label">Height</div>
                        <div class="spec-value">${robotData.specs.height}</div>
                    </div>
                `;
            }
            
            if (robotData.specs.width) {
                specsHTML += `
                    <div class="spec-item">
                        <div class="spec-label">Width</div>
                        <div class="spec-value">${robotData.specs.width}</div>
                    </div>
                `;
            }
            
            if (robotData.specs.length) {
                specsHTML += `
                    <div class="spec-item">
                        <div class="spec-label">Length</div>
                        <div class="spec-value">${robotData.specs.length}</div>
                    </div>
                `;
            }
            
            if (robotData.specs.weight) {
                specsHTML += `
                    <div class="spec-item">
                        <div class="spec-label">Weight</div>
                        <div class="spec-value">${robotData.specs.weight}</div>
                    </div>
                `;
            }
            
            specsHTML += '</div>';
            
            // Group 2 - Performance specs
            specsHTML += '<div class="spec-group"><h3 class="spec-title">Performance</h3>';
            
            if (robotData.specs.runtime) {
                specsHTML += `
                    <div class="spec-item">
                        <div class="spec-label">Runtime</div>
                        <div class="spec-value">${robotData.specs.runtime}</div>
                    </div>
                `;
            }
            
            if (robotData.specs.maxSpeed) {
                specsHTML += `
                    <div class="spec-item">
                        <div class="spec-label">Max Speed</div>
                        <div class="spec-value">${robotData.specs.maxSpeed}</div>
                    </div>
                `;
            }
            
            if (robotData.specs.dof) {
                specsHTML += `
                    <div class="spec-item">
                        <div class="spec-label">Degrees of Freedom</div>
                        <div class="spec-value">${robotData.specs.dof}</div>
                    </div>
                `;
            }
            
            if (robotData.specs.maxIncline) {
                specsHTML += `
                    <div class="spec-item">
                        <div class="spec-label">Max Incline</div>
                        <div class="spec-value">${robotData.specs.maxIncline}</div>
                    </div>
                `;
            }
            
            specsHTML += '</div></div>';
            
            // Group 3 - Additional specs
            specsHTML += '<div>';
            
            if (robotData.specs.power || robotData.specs.sensorSuite) {
                specsHTML += '<div class="spec-group"><h3 class="spec-title">System</h3>';
                
                if (robotData.specs.power) {
                    specsHTML += `
                        <div class="spec-item">
                            <div class="spec-label">Power</div>
                            <div class="spec-value">${robotData.specs.power}</div>
                        </div>
                    `;
                }
                
                if (robotData.specs.sensorSuite) {
                    specsHTML += `
                        <div class="spec-item">
                            <div class="spec-label">Sensors</div>
                            <div class="spec-value">${robotData.specs.sensorSuite}</div>
                        </div>
                    `;
                }
                
                specsHTML += '</div>';
            }
            
            specsHTML += '</div>';
            
            // Update the specs content
            specsContent.innerHTML = specsHTML;
        }
        
        // Update Applications tab content
        const applicationsContent = document.querySelector('#applications .application-cards');
        if (applicationsContent && robotData.applications) {
            let applicationsHTML = '';
            
            robotData.applications.forEach(application => {
                applicationsHTML += `
                    <div class="application-card">
                        <img src="images/applications/${application.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${application}" class="application-image" onerror="this.src='images/placeholder.jpg'">
                        <div class="application-content">
                            <h3 class="application-title">${application}</h3>
                            <p class="application-desc">
                                ${getApplicationDescription(application)}
                            </p>
                            <a href="applications.html?type=${application.toLowerCase().replace(/\s+/g, '-')}" class="btn btn-outline">Learn More</a>
                        </div>
                    </div>
                `;
            });
            
            // Update the applications content
            applicationsContent.innerHTML = applicationsHTML;
        }
    }
    
    // Helper function to get application descriptions
    function getApplicationDescription(application) {
        const descriptions = {
            'Industrial Inspection': 'Automate routine inspections in industrial facilities. The robot can navigate complex environments and capture consistent data for preventative maintenance.',
            'Construction Monitoring': 'Capture site data consistently and frequently to track progress, improve safety, and document site conditions throughout the project lifecycle.',
            'Public Safety': 'Assess hazardous situations, provide situational awareness, and handle dangerous materials in emergency response scenarios.',
            'Entertainment': 'Create engaging and interactive experiences for audiences through dynamic performances and demonstrations.',
            'Research': 'Advance the state of robotics through experimental testing of new algorithms, sensors, and mechanical systems.',
            'Disaster Response': 'Navigate complex and dangerous environments after natural disasters to locate survivors and assess structural damage.',
            'Search and Rescue': 'Assist in locating and possibly extracting individuals in dangerous or inaccessible environments.',
            'Military Applications': 'Support defense operations through reconnaissance, logistics, and potentially direct combat engagement.'
        };
        
        return descriptions[application] || 'This robot can be applied to various scenarios in this domain, enhancing efficiency and capabilities.';
    }
});
