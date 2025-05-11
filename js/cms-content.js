/**
 * CMS Content Script
 * Handles loading and processing CMS content from markdown files
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize processing of CMS content
    initCmsContent();
});

/**
 * Initialize CMS content processing
 */
function initCmsContent() {
    // If we're on the home page with robot grid
    const robotGrid = document.querySelector('.robot-grid');
    if (robotGrid) {
        loadRobotEntries();
    }
    
    // If we're on the encyclopedia page
    const encyclopediaContent = document.querySelector('.encyclopedia-content');
    if (encyclopediaContent) {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        loadRobotEntries(category);
    }
    
    // If we're on a single robot page
    const robotDetail = document.querySelector('.robot-detail');
    if (robotDetail) {
        // Get robot slug from URL
        const pathSegments = window.location.pathname.split('/');
        const slug = pathSegments[pathSegments.length - 1].replace('.html', '');
        loadSingleRobot(slug);
    }
}

/**
 * Load all robot entries, optionally filtered by category
 */
function loadRobotEntries(category = null) {
    // Create robots.json dynamically
    fetch('/_robots/')
        .then(response => {
            if (!response.ok) {
                // Fallback to placeholder data
                return Promise.resolve({
                    robots: getSampleRobots()
                });
            }
            return response.json();
        })
        .then(data => {
            let robots = data.robots || getSampleRobots();
            
            // Filter by category if specified
            if (category) {
                robots = robots.filter(robot => 
                    robot.category && robot.category.toLowerCase() === category.toLowerCase()
                );
            }
            
            // Display robots
            displayRobots(robots);
        })
        .catch(error => {
            console.error('Error loading robot entries:', error);
            // Use sample data as fallback
            displayRobots(getSampleRobots());
        });
}

/**
 * Load a single robot entry
 */
function loadSingleRobot(slug) {
    fetch(`/_robots/${slug}.md`)
        .then(response => {
            if (!response.ok) {
                // Try JSON format
                return fetch(`/_robots/${slug}.json`);
            }
            return response;
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Robot entry not found');
            }
            
            // Determine format and process accordingly
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return response.text().then(text => parseFrontMatter(text));
            }
        })
        .then(robotData => {
            displaySingleRobot(robotData);
        })
        .catch(error => {
            console.error('Error loading robot data:', error);
            // Display error message
            const robotDetail = document.querySelector('.robot-detail');
            if (robotDetail) {
                robotDetail.innerHTML = `
                    <div class="error-message">
                        <h2>Robot Not Found</h2>
                        <p>The requested robot entry could not be found.</p>
                        <a href="encyclopedia.html" class="btn btn-primary">Back to Encyclopedia</a>
                    </div>
                `;
            }
        });
}

/**
 * Parse front matter from markdown
 */
function parseFrontMatter(markdown) {
    const frontMatterRegex = /---\n([\s\S]*?)\n---\n([\s\S]*)/;
    const match = frontMatterRegex.exec(markdown);
    
    if (!match) return { content: markdown };
    
    const frontMatter = match[1];
    const content = match[2];
    
    // Parse front matter into object
    const data = {};
    const lines = frontMatter.split('\n');
    
    lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            let value = valueParts.join(':').trim();
            
            // Handle lists (tags)
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(item => item.trim());
            }
            
            data[key.trim()] = value;
        }
    });
    
    return {
        ...data,
        content: content
    };
}

/**
 * Display robots in the appropriate container
 */
function displayRobots(robots) {
    // Check if we're on the home page (featured robots)
    const robotGrid = document.querySelector('.robot-grid');
    if (robotGrid) {
        // Display only first 3 robots on home page
        const featuredRobots = robots.slice(0, 3);
        robotGrid.innerHTML = '';
        
        featuredRobots.forEach(robot => {
            const robotCard = createRobotCard(robot);
            robotGrid.appendChild(robotCard);
        });
    }
    
    // Check if we're on the encyclopedia page
    const encyclopediaContent = document.querySelector('.encyclopedia-content');
    if (encyclopediaContent) {
        const robotsGrid = document.createElement('div');
        robotsGrid.className = 'robots-grid';
        
        if (robots.length === 0) {
            // No robots found
            encyclopediaContent.innerHTML = `
                <div class="no-results">
                    <h2>No Robots Found</h2>
                    <p>No robots match your search criteria.</p>
                    <a href="encyclopedia.html" class="btn btn-primary">View All Robots</a>
                </div>
            `;
        } else {
            // Display all robots
            robots.forEach(robot => {
                const robotCard = createRobotCard(robot);
                robotsGrid.appendChild(robotCard);
            });
            
            encyclopediaContent.innerHTML = '';
            encyclopediaContent.appendChild(robotsGrid);
        }
    }
}

/**
 * Create a robot card element
 */
function createRobotCard(robot) {
    const card = document.createElement('div');
    card.className = 'robot-card';
    
    // Set default image if none provided
    const imageUrl = robot.image || 'images/robots/placeholder.jpg';
    const slug = robot.slug || robot.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    card.innerHTML = `
        <div class="robot-image">
            <img src="${imageUrl}" alt="${robot.title}">
        </div>
        <div class="robot-content">
            <h3 class="robot-title">${robot.title}</h3>
            ${robot.category ? `<div class="robot-category">${robot.category}</div>` : ''}
            <p class="robot-description">${robot.description ? robot.description.substring(0, 120) + '...' : ''}</p>
            <a href="robot/${slug}.html" class="btn btn-outline">View Details</a>
        </div>
    `;
    
    return card;
}

/**
 * Display single robot detail
 */
function displaySingleRobot(robot) {
    const robotDetail = document.querySelector('.robot-detail');
    if (!robotDetail) return;
    
    const imageUrl = robot.image || 'images/robots/placeholder.jpg';
    
    // Create tags HTML
    let tagsHtml = '';
    if (robot.tags && Array.isArray(robot.tags)) {
        tagsHtml = `
            <div class="robot-tags">
                ${robot.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
    }
    
    // Create video embed if provided
    let videoHtml = '';
    if (robot.video_url) {
        videoHtml = `
            <div class="robot-video">
                <iframe width="100%" height="315" src="${robot.video_url}" frameborder="0" allowfullscreen></iframe>
            </div>
        `;
    }
    
    // Set page content
    robotDetail.innerHTML = `
        <div class="robot-header">
            <h1 class="robot-title">${robot.title}</h1>
            ${robot.category ? `<div class="robot-category">${robot.category}</div>` : ''}
            ${tagsHtml}
        </div>
        
        <div class="robot-content-grid">
            <div class="robot-image-container">
                <img src="${imageUrl}" alt="${robot.title}" class="robot-main-image">
                ${videoHtml}
            </div>
            
            <div class="robot-content-container">
                <div class="robot-description">
                    ${robot.description || ''}
                </div>
                
                <div class="robot-body">
                    ${robot.content || ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Get sample robot data for fallback
 */
function getSampleRobots() {
    return [
        {
            title: 'Atlas',
            slug: 'atlas',
            category: 'Humanoid',
            image: '/images/uploads/atlas.jpg',
            description: 'Atlas is a bipedal humanoid robot primarily developed by Boston Dynamics. One of the most advanced humanoid robots in the world, Atlas can navigate uneven terrain, perform dynamic movements like backflips, and manipulate objects with its hands.',
            tags: ['Boston Dynamics', 'Humanoid', 'Advanced']
        },
        {
            title: 'Spot',
            slug: 'spot',
            category: 'Service',
            image: '/images/robots/placeholder.jpg',
            description: 'Spot is a four-legged robot developed by Boston Dynamics. It can navigate terrain with unprecedented mobility for a robot, making it ideal for industrial inspection and data collection tasks.',
            tags: ['Boston Dynamics', 'Quadruped', 'Mobile']
        },
        {
            title: 'Pepper',
            slug: 'pepper',
            category: 'Humanoid',
            image: '/images/robots/placeholder.jpg',
            description: 'Pepper is a social humanoid robot manufactured by SoftBank Robotics. It is designed with the ability to read emotions and adapt its behavior to the mood of the humans around it.',
            tags: ['SoftBank Robotics', 'Humanoid', 'Social Robot']
        }
    ];
}
