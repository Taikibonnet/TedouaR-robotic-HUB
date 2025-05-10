// TedouaR Robotics Hub - Encyclopedia JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sample robot data (in a real implementation, this would be fetched from a database)
    const robotsData = {
        'spot': {
            id: 'spot',
            name: 'Spot',
            manufacturer: 'Boston Dynamics',
            description: 'An agile mobile robot that navigates terrain with unprecedented mobility, allowing you to automate routine inspection tasks and data capture safely.',
            details: 'Spot is designed to go where wheeled robots cannot, while carrying payloads with endurance far beyond aerial drones. With 360° vision and obstacle avoidance, Spot can be driven remotely or taught routes to follow autonomously.',
            categories: ['industrial', 'quadruped'],
            featured: true,
            popular: true,
            image: 'images/robots/spot.jpg',
            specs: [
                { label: 'Height', value: '0.84 m' },
                { label: 'Width', value: '0.43 m' },
                { label: 'Length', value: '1.1 m' },
                { label: 'Weight', value: '32.5 kg' },
                { label: 'Runtime', value: '90 minutes' },
                { label: 'Max Speed', value: '1.6 m/s' },
                { label: 'DoF', value: '12' },
                { label: 'Max Incline', value: '30 degrees' }
            ],
            applications: [
                { name: 'Industrial Inspection', description: 'Automate routine inspections in industrial facilities.' },
                { name: 'Construction Monitoring', description: 'Capture site data consistently and frequently to track progress.' },
                { name: 'Public Safety', description: 'Assess hazardous situations and provide situational awareness.' }
            ],
            videos: ['https://www.youtube.com/embed/wlkCQXHEgjA']
        },
        'atlas': {
            id: 'atlas',
            name: 'Atlas',
            manufacturer: 'Boston Dynamics',
            description: 'Atlas is the most dynamic humanoid robot in the world, designed to navigate rough terrain and perform complex physical tasks.',
            details: 'Atlas uses its whole body, including legs, arms, and torso, to perform tasks, just like a human would. It can manipulate the world by using its hands to lift, carry, and toss heavy objects.',
            categories: ['humanoid', 'research'],
            featured: true,
            popular: true,
            image: 'images/robots/atlas.jpg',
            specs: [
                { label: 'Height', value: '1.5 m' },
                { label: 'Width', value: '0.61 m' },
                { label: 'Weight', value: '89 kg' },
                { label: 'DoF', value: '28' },
                { label: 'Power', value: 'Electric and hydraulic' },
                { label: 'Sensors', value: 'Depth cameras, IMU, proprioception' }
            ],
            applications: [
                { name: 'Research', description: 'Advance the state of robotics through experimental testing.' },
                { name: 'Disaster Response', description: 'Navigate complex environments after natural disasters.' }
            ],
            videos: ['https://www.youtube.com/embed/_sBBaNYex3E']
        },
        'anymal': {
            id: 'anymal',
            name: 'ANYmal',
            manufacturer: 'ANYbotics',
            description: 'ANYmal is an autonomous four-legged robot designed for inspection and monitoring tasks in challenging environments.',
            details: 'With its ability to navigate stairs, climb over obstacles, and walk on various types of terrain, ANYmal is ideal for industrial inspections, oil and gas installations, and construction sites. It features advanced sensors for mapping and object detection.',
            categories: ['industrial', 'quadruped'],
            featured: false,
            popular: true,
            image: 'images/robots/anymal.jpg',
            specs: [
                { label: 'Height', value: '0.7 m' },
                { label: 'Width', value: '0.5 m' },
                { label: 'Length', value: '0.79 m' },
                { label: 'Weight', value: '30 kg' },
                { label: 'Runtime', value: '2-4 hours' },
                { label: 'Max Speed', value: '1.0 m/s' }
            ],
            applications: [
                { name: 'Industrial Inspection', description: 'Perform routine inspections in industrial facilities.' },
                { name: 'Oil & Gas', description: 'Monitor offshore platforms and refineries.' },
                { name: 'Security', description: 'Autonomous patrol and surveillance.' }
            ],
            videos: ['https://www.youtube.com/embed/5rX11qvzJRk']
        },
        'pepper': {
            id: 'pepper',
            name: 'Pepper',
            manufacturer: 'SoftBank Robotics',
            description: 'Pepper is a semi-humanoid robot designed to recognize human emotions and adapt its behavior to the mood of the people around it.',
            details: 'Standing 120 cm tall, Pepper is equipped with a 3D camera and various sensors to perceive its environment. It can navigate autonomously, recognize faces and basic human emotions, and engage in conversation through its touchscreen display and voice recognition capabilities.',
            categories: ['service', 'humanoid'],
            featured: false,
            popular: true,
            image: 'images/robots/pepper.jpg',
            specs: [
                { label: 'Height', value: '1.2 m' },
                { label: 'Weight', value: '28 kg' },
                { label: 'Runtime', value: '12 hours' },
                { label: 'Max Speed', value: '0.83 m/s' },
                { label: 'DoF', value: '20' },
                { label: 'Languages', value: 'English, Japanese, French, etc.' }
            ],
            applications: [
                { name: 'Customer Service', description: 'Greet and assist customers in retail environments.' },
                { name: 'Healthcare', description: 'Provide companionship and basic assistance in healthcare settings.' },
                { name: 'Education', description: 'Interactive learning assistant in educational settings.' }
            ],
            videos: ['https://www.youtube.com/embed/lWUXiT5m17k']
        },
        'roomba': {
            id: 'roomba',
            name: 'Roomba',
            manufacturer: 'iRobot',
            description: 'Roomba is an autonomous robotic vacuum cleaner that navigates and cleans homes with minimal human intervention.',
            details: 'Since its introduction in 2002, Roomba has evolved to include advanced navigation systems, self-emptying capabilities, and smart home integration. Modern models can map homes, recognize obstacles, and be controlled remotely via smartphone apps.',
            categories: ['consumer', 'service'],
            featured: false,
            popular: true,
            image: 'images/robots/roomba.jpg',
            specs: [
                { label: 'Height', value: '9.1 cm' },
                { label: 'Diameter', value: '33.5 cm' },
                { label: 'Weight', value: '3.4 kg' },
                { label: 'Runtime', value: 'Up to 90 minutes' },
                { label: 'Suction Power', value: 'Up to 2200 Pa' },
                { label: 'Navigation', value: 'vSLAM technology' }
            ],
            applications: [
                { name: 'Home Cleaning', description: 'Autonomous vacuum cleaning for residential spaces.' },
                { name: 'Pet Hair Removal', description: 'Specialized cleaning for homes with pets.' },
                { name: 'Smart Home Integration', description: 'Integration with voice assistants and smart home systems.' }
            ],
            videos: ['https://www.youtube.com/embed/t-_u8v6JvaU']
        },
        'perseverance': {
            id: 'perseverance',
            name: 'Perseverance',
            manufacturer: 'NASA',
            description: 'The Perseverance rover is designed to explore the surface of Mars, searching for signs of ancient microbial life and collecting samples for potential return to Earth.',
            details: 'Launched in July 2020 and landed on Mars in February 2021, Perseverance carries seven primary science instruments, a sample caching system, and the Ingenuity helicopter—a technology demonstration to test powered flight on Mars. The rover continues NASA\'s exploration of the Red Planet.',
            categories: ['space', 'rover'],
            featured: true,
            popular: false,
            image: 'images/robots/perseverance.jpg',
            specs: [
                { label: 'Length', value: '3 m' },
                { label: 'Width', value: '2.7 m' },
                { label: 'Height', value: '2.2 m' },
                { label: 'Weight', value: '1,025 kg' },
                { label: 'Power', value: 'MMRTG (radioisotope)' },
                { label: 'Top Speed', value: '0.15 km/h' },
                { label: 'Mission Duration', value: 'At least one Mars year (687 Earth days)' }
            ],
            applications: [
                { name: 'Astrobiology', description: 'Search for signs of ancient microbial life.' },
                { name: 'Geology', description: 'Study the planet\'s geology and climate.' },
                { name: 'Sample Collection', description: 'Collect samples for potential return to Earth.' },
                { name: 'Technology Demonstration', description: 'Test oxygen production from the Martian atmosphere.' }
            ],
            videos: ['https://www.youtube.com/embed/gYQwuYZbA6o']
        },
        'cyberdog': {
            id: 'cyberdog',
            name: 'CyberDog',
            manufacturer: 'Xiaomi',
            description: 'CyberDog is an open-source quadruped robot platform developed by Xiaomi, designed to be both a consumer product and a platform for developers.',
            details: 'Powered by NVIDIA's Jetson Xavier NX platform, CyberDog features multiple cameras and sensors for real-time object tracking and autonomous navigation. It can perform various movements, recognize voice commands, and follow its owner.',
            categories: ['consumer', 'quadruped'],
            featured: false,
            popular: false,
            image: 'images/robots/cyberdog.jpg',
            specs: [
                { label: 'Height', value: '0.4 m' },
                { label: 'Length', value: '0.9 m' },
                { label: 'Weight', value: '14 kg' },
                { label: 'Max Speed', value: '3.2 m/s' },
                { label: 'DoF', value: '12' },
                { label: 'Computing', value: 'NVIDIA Jetson Xavier NX' },
                { label: 'Battery', value: 'Lithium-ion' }
            ],
            applications: [
                { name: 'Companionship', description: 'Interactive robotic pet and assistant.' },
                { name: 'Research', description: 'Open-source platform for robotics development.' },
                { name: 'Entertainment', description: 'Performing tricks and demonstrations.' }
            ],
            videos: ['https://www.youtube.com/embed/TZ5FEcW9X5U']
        }
    };

    // Get encyclopedia elements
    const robotGrid = document.querySelector('.robot-grid');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const searchInput = document.getElementById('robot-search');
    const sortSelect = document.getElementById('sort-select');
    
    // Check if we're on the encyclopedia page
    if (!robotGrid) return;
    
    // Get URL parameters for initial filtering
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Initialize filters
    let activeFilters = categoryParam ? [categoryParam] : [];
    let searchTerm = '';
    let sortOption = 'name-asc';
    
    // Initialize category filter buttons
    if (categoryFilters) {
        categoryFilters.forEach(filter => {
            const category = filter.getAttribute('data-category');
            
            // Set active state based on URL parameter
            if (categoryParam && category === categoryParam) {
                filter.classList.add('active');
            }
            
            // Add click event listener
            filter.addEventListener('click', function() {
                // Toggle active state
                this.classList.toggle('active');
                
                // Update active filters
                const category = this.getAttribute('data-category');
                
                if (this.classList.contains('active')) {
                    // Add filter
                    activeFilters.push(category);
                } else {
                    // Remove filter
                    activeFilters = activeFilters.filter(f => f !== category);
                }
                
                // Update display
                updateRobotDisplay();
            });
        });
    }
    
    // Initialize search input
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchTerm = this.value.trim().toLowerCase();
            updateRobotDisplay();
        });
    }
    
    // Initialize sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortOption = this.value;
            updateRobotDisplay();
        });
    }
    
    // Initial display
    updateRobotDisplay();
    
    // Function to update robot display based on filters, search, and sort
    function updateRobotDisplay() {
        if (!robotGrid) return;
        
        // Clear current display
        robotGrid.innerHTML = '';
        
        // Filter robots
        let filteredRobots = Object.values(robotsData);
        
        // Apply category filters
        if (activeFilters.length > 0) {
            if (activeFilters.includes('featured')) {
                filteredRobots = filteredRobots.filter(robot => robot.featured);
            } else if (activeFilters.includes('popular')) {
                filteredRobots = filteredRobots.filter(robot => robot.popular);
            } else if (activeFilters.includes('new')) {
                // In a real implementation, this would filter by date added
                // For this demo, we'll just show some random robots
                filteredRobots = filteredRobots.filter((_, index) => index % 2 === 0);
            } else {
                // Filter by regular categories
                filteredRobots = filteredRobots.filter(robot => 
                    activeFilters.some(filter => robot.categories.includes(filter))
                );
            }
        }
        
        // Apply search term
        if (searchTerm) {
            filteredRobots = filteredRobots.filter(robot => 
                robot.name.toLowerCase().includes(searchTerm) ||
                robot.manufacturer.toLowerCase().includes(searchTerm) ||
                robot.description.toLowerCase().includes(searchTerm) ||
                robot.categories.some(cat => cat.toLowerCase().includes(searchTerm))
            );
        }
        
        // Sort robots
        switch (sortOption) {
            case 'name-asc':
                filteredRobots.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredRobots.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'manufacturer':
                filteredRobots.sort((a, b) => a.manufacturer.localeCompare(b.manufacturer));
                break;
            default:
                // Default to name ascending
                filteredRobots.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        // Show no results message if needed
        if (filteredRobots.length === 0) {
            robotGrid.innerHTML = '<div class="no-results">No robots found matching your criteria. Try adjusting your filters or search term.</div>';
            return;
        }
        
        // Create robot cards
        filteredRobots.forEach(robot => {
            const robotCard = document.createElement('div');
            robotCard.className = 'robot-card';
            
            // Create category pills HTML
            let categoryPills = '';
            robot.categories.forEach(category => {
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                categoryPills += `<span class="category-pill">${categoryName}</span>`;
            });
            
            robotCard.innerHTML = `
                <a href="robot-detail.html?id=${robot.id}" class="robot-card-link">
                    <div class="robot-card-image">
                        <img src="${robot.image}" alt="${robot.name}">
                    </div>
                    <div class="robot-card-content">
                        <div class="robot-card-header">
                            <h3 class="robot-card-title">${robot.name}</h3>
                            <div class="robot-card-categories">
                                ${categoryPills}
                            </div>
                        </div>
                        <p class="robot-card-manufacturer">${robot.manufacturer}</p>
                        <p class="robot-card-description">${robot.description}</p>
                    </div>
                </a>
            `;
            
            robotGrid.appendChild(robotCard);
        });
    }

    // Expose robot data to window for use in other scripts
    window.robotsData = robotsData;
});
