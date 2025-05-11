// encyclopedia.js - Manage robot data and display

// Sample robot data for testing (will be replaced by CMS data)
window.robotsData = {
    "r001": {
        "id": "r001",
        "name": "Atlas",
        "manufacturer": "Boston Dynamics",
        "description": "A bipedal humanoid robot designed for a variety of search and rescue tasks. Atlas can navigate rough terrain and manipulate objects in its environment.",
        "featured": true,
        "categories": ["humanoid", "research"],
        "image": "images/robots/atlas.jpg",
        "specs": [
            { "label": "height", "value": "1.5 meters" },
            { "label": "weight", "value": "80 kg" },
            { "label": "powerSource", "value": "Electric (battery)" },
            { "label": "battery", "value": "3 hours operation" },
            { "label": "sensors", "value": "LIDAR, Stereo Vision, IMU" },
            { "label": "dof", "value": "28" },
            { "label": "payload", "value": "11 kg" }
        ],
        "applications": [
            { "name": "Search and rescue", "description": "Locate and assist people in disaster scenarios" },
            { "name": "Research and development", "description": "Test new algorithms and technologies" },
            { "name": "Military applications", "description": "Support for various military tasks" },
            { "name": "Disaster response", "description": "Navigate hazardous environments" }
        ],
        "videos": [
            {
                "title": "Atlas Parkour",
                "url": "https://www.youtube.com/embed/tF4DML7FIWk"
            }
        ]
    },
    "r002": {
        "id": "r002",
        "name": "Spot",
        "manufacturer": "Boston Dynamics",
        "description": "A four-legged robot that can navigate terrain that wheeled robots cannot. Spot can carry payloads, climb stairs and operate in environments that are challenging for other robots.",
        "featured": true,
        "categories": ["quadruped", "industrial"],
        "image": "images/robots/spot.jpg",
        "specs": [
            { "label": "height", "value": "0.84 meters" },
            { "label": "weight", "value": "32.5 kg" },
            { "label": "powerSource", "value": "Electric (battery)" },
            { "label": "battery", "value": "90 minutes operation" },
            { "label": "sensors", "value": "Stereo Cameras, LIDAR, IMU" },
            { "label": "dof", "value": "12" },
            { "label": "payload", "value": "14 kg" }
        ],
        "applications": [
            { "name": "Industrial inspection", "description": "Inspect facilities and equipment" },
            { "name": "Construction monitoring", "description": "Monitor progress and safety at construction sites" },
            { "name": "Public safety", "description": "Assist in public safety operations" },
            { "name": "Entertainment", "description": "Perform in shows and entertainment venues" }
        ],
        "videos": [
            {
                "title": "Spot Robot: Navigating Challenging Terrain",
                "url": "https://www.youtube.com/embed/wlkCQXHEgjA"
            }
        ]
    },
    // Other robots remain the same...
};

// Store reference to initialize function in window for access by cms-content.js
window.initializeEncyclopedia = initializeEncyclopedia;
window.initializeRobotDetail = initializeRobotDetail;

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the encyclopedia page
    const isEncyclopediaPage = document.querySelector('.encyclopedia-container');
    
    if (isEncyclopediaPage) {
        // Only initialize if we have robot data
        // This will be called by cms-content.js after it loads data
        if (window.robotsData && Object.keys(window.robotsData).length > 0) {
            initializeEncyclopedia();
        }
    }
    
    // Initialize detailed robot view if on robot-detail page
    const isRobotDetailPage = document.querySelector('.robot-detail-container');
    
    if (isRobotDetailPage) {
        // Only initialize if we have robot data
        // This will be called by cms-content.js after it loads data
        if (window.robotsData && Object.keys(window.robotsData).length > 0) {
            initializeRobotDetail();
        }
    }
});

// Initialize the encyclopedia page
function initializeEncyclopedia() {
    const robotGrid = document.querySelector('.robot-grid');
    const searchInput = document.getElementById('search-robots');
    const categoryFilter = document.getElementById('category-filter');
    const sortOption = document.getElementById('sort-option');
    
    // Get URL parameters (for filtering from other pages)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Set initial category filter if provided in URL
    if (categoryParam && categoryFilter) {
        categoryFilter.value = categoryParam;
    }
    
    // Apply initial filters
    filterAndSortRobots();
    
    // Set up event listeners for filtering and sorting
    if (searchInput) {
        searchInput.addEventListener('input', filterAndSortRobots);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndSortRobots);
    }
    
    if (sortOption) {
        sortOption.addEventListener('change', filterAndSortRobots);
    }
    
    // Function to filter and sort robots
    function filterAndSortRobots() {
        // Get filter values
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const categoryValue = categoryFilter ? categoryFilter.value : 'all';
        const sortValue = sortOption ? sortOption.value : 'name-asc';
        
        // Filter robots
        let filteredRobots = Object.values(window.robotsData).filter(robot => {
            // Filter by search term
            const matchesSearch = 
                robot.name.toLowerCase().includes(searchTerm) || 
                robot.manufacturer.toLowerCase().includes(searchTerm) || 
                robot.description.toLowerCase().includes(searchTerm);
            
            // Filter by category
            const matchesCategory = 
                categoryValue === 'all' || 
                (categoryValue === 'featured' && robot.featured) || 
                (robot.categories && robot.categories.includes(categoryValue));
            
            return matchesSearch && matchesCategory;
        });
        
        // Sort robots
        switch (sortValue) {
            case 'name-asc':
                filteredRobots.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredRobots.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'manufacturer-asc':
                filteredRobots.sort((a, b) => a.manufacturer.localeCompare(b.manufacturer));
                break;
            case 'manufacturer-desc':
                filteredRobots.sort((a, b) => b.manufacturer.localeCompare(a.manufacturer));
                break;
        }
        
        // Update the grid
        updateRobotGrid(filteredRobots);
    }
    
    // Function to update the robot grid with filtered and sorted robots
    function updateRobotGrid(robots) {
        if (!robotGrid) return;
        
        // Clear existing robots
        robotGrid.innerHTML = '';
        
        if (robots.length === 0) {
            // No results message
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No robots found matching your criteria. Try adjusting your filters.';
            robotGrid.appendChild(noResults);
            return;
        }
        
        // Add filtered robots to grid
        robots.forEach(robot => {
            const robotCard = document.createElement('div');
            robotCard.className = 'robot-card';
            
            // Create category pills HTML
            let categoryPills = '';
            if (robot.categories) {
                robot.categories.forEach(category => {
                    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                    categoryPills += `<span class="category-pill">${categoryName}</span>`;
                });
            }
            
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
}

// Initialize the robot detail page
function initializeRobotDetail() {
    // Get robot ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const robotId = urlParams.get('id');
    
    if (!robotId || !window.robotsData[robotId]) {
        // Robot not found, redirect to encyclopedia
        window.location.href = 'encyclopedia.html';
        return;
    }
    
    // Get robot data
    const robot = window.robotsData[robotId];
    
    // Update page title
    document.title = `${robot.name} - TedouaR Robotics Hub`;
    
    // Update robot details
    updateRobotDetails(robot);
    
    // Set up tab navigation
    setupTabs();
    
    // Set up sharing functionality
    setupSharing(robot);
}

// Update robot details on the detail page
function updateRobotDetails(robot) {
    // Update basic info
    const robotName = document.querySelector('.robot-name');
    const robotManufacturer = document.querySelector('.robot-manufacturer');
    const robotDescription = document.querySelector('.robot-description');
    const robotImage = document.querySelector('.robot-detail-image img');
    const robotCategories = document.querySelector('.robot-categories');
    
    if (robotName) robotName.textContent = robot.name;
    if (robotManufacturer) robotManufacturer.textContent = robot.manufacturer;
    if (robotDescription) robotDescription.textContent = robot.description;
    if (robotImage) robotImage.src = robot.image;
    
    // Update categories
    if (robotCategories && robot.categories) {
        robotCategories.innerHTML = '';
        
        robot.categories.forEach(category => {
            const categoryPill = document.createElement('span');
            categoryPill.className = 'category-pill';
            categoryPill.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            robotCategories.appendChild(categoryPill);
        });
    }
    
    // Update specifications
    const specsContainer = document.querySelector('.tab-content[data-tab="specifications"]');
    
    if (specsContainer && robot.specs && robot.specs.length > 0) {
        const specsList = document.createElement('div');
        specsList.className = 'specs-list';
        
        robot.specs.forEach(spec => {
            const specItem = document.createElement('div');
            specItem.className = 'spec-item';
            
            const specName = document.createElement('div');
            specName.className = 'spec-name';
            specName.textContent = spec.label.charAt(0).toUpperCase() + spec.label.slice(1).replace(/([A-Z])/g, ' $1');
            
            const specValue = document.createElement('div');
            specValue.className = 'spec-value';
            specValue.textContent = spec.value;
            
            specItem.appendChild(specName);
            specItem.appendChild(specValue);
            specsList.appendChild(specItem);
        });
        
        specsContainer.innerHTML = '';
        specsContainer.appendChild(specsList);
    } else if (specsContainer) {
        specsContainer.innerHTML = '<p class="no-specs">No specifications available for this robot.</p>';
    }
    
    // Update applications
    const applicationsContainer = document.querySelector('.tab-content[data-tab="applications"]');
    
    if (applicationsContainer && robot.applications && robot.applications.length > 0) {
        const applicationsList = document.createElement('div');
        applicationsList.className = 'applications-list';
        
        robot.applications.forEach(application => {
            const applicationItem = document.createElement('div');
            applicationItem.className = 'application-item';
            
            const applicationName = document.createElement('h3');
            applicationName.className = 'application-name';
            applicationName.textContent = application.name;
            
            const applicationDesc = document.createElement('p');
            applicationDesc.className = 'application-description';
            applicationDesc.textContent = application.description;
            
            applicationItem.appendChild(applicationName);
            applicationItem.appendChild(applicationDesc);
            applicationsList.appendChild(applicationItem);
        });
        
        applicationsContainer.innerHTML = '';
        applicationsContainer.appendChild(applicationsList);
    } else if (applicationsContainer) {
        applicationsContainer.innerHTML = '<p class="no-applications">No applications available for this robot.</p>';
    }
    
    // Update videos
    const videosContainer = document.querySelector('.tab-content[data-tab="videos"]');
    
    if (videosContainer && robot.videos && robot.videos.length > 0) {
        videosContainer.innerHTML = '';
        
        robot.videos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            
            const videoTitle = document.createElement('h3');
            videoTitle.textContent = video.title;
            
            const videoFrame = document.createElement('div');
            videoFrame.className = 'video-frame';
            videoFrame.innerHTML = `<iframe width="100%" height="315" src="${video.url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            
            videoItem.appendChild(videoTitle);
            videoItem.appendChild(videoFrame);
            videosContainer.appendChild(videoItem);
        });
    } else if (videosContainer) {
        videosContainer.innerHTML = '<p class="no-videos">No videos available for this robot.</p>';
    }
    
    // Display detailed description if available
    if (robot.details) {
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'robot-details';
        detailsContainer.innerHTML = robot.details;
        
        const descriptionElement = document.querySelector('.robot-description');
        if (descriptionElement) {
            descriptionElement.parentNode.insertBefore(detailsContainer, descriptionElement.nextSibling);
        }
    }
}

// Set up tab navigation on the detail page
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length === 0 || tabContents.length === 0) return;
    
    // Set first tab as active by default
    tabButtons[0].classList.add('active');
    tabContents[0].classList.add('active');
    
    // Add click event to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get tab target
            const tabTarget = button.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            
            const targetContent = document.querySelector(`.tab-content[data-tab="${tabTarget}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Set up sharing functionality
function setupSharing(robot) {
    const shareButtons = document.querySelectorAll('.share-button');
    
    if (!shareButtons) return;
    
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(`${robot.name} - TedouaR Robotics Hub`);
    
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const platform = button.getAttribute('data-platform');
            let shareUrl = '';
            
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${pageTitle}&body=Check out this robot: ${window.location.href}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}