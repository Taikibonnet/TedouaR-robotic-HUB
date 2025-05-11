/**
 * Encyclopedia JavaScript
 * This script handles the loading and displaying of robot entries from the _robots folder
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the home page with the robot-grid
  const robotGrid = document.querySelector('.robot-grid');
  if (robotGrid) {
    loadFeaturedRobots(robotGrid);
  }
  
  // Check if we're on the encyclopedia page
  const encyclopediaContent = document.querySelector('.encyclopedia-content');
  if (encyclopediaContent) {
    loadAllRobots(encyclopediaContent);
  }
});

/**
 * Load featured robots for the home page
 */
function loadFeaturedRobots(container) {
  // Fetch the list of robot entries from the _robots folder
  fetch('/robots.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load robot data');
      }
      return response.json();
    })
    .then(robots => {
      // Sort by date and take the first 3
      const featuredRobots = robots.slice(0, 3);
      
      // Display the robots
      featuredRobots.forEach(robot => {
        const robotCard = createRobotCard(robot);
        container.appendChild(robotCard);
      });
    })
    .catch(error => {
      console.error('Error loading robots:', error);
      // Display placeholder content if data can't be loaded
      displayPlaceholderRobots(container);
    });
}

/**
 * Load all robots for the encyclopedia page
 */
function loadAllRobots(container) {
  // Get query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFilter = urlParams.get('category');
  
  // Fetch the list of robot entries
  fetch('/robots.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load robot data');
      }
      return response.json();
    })
    .then(robots => {
      // Filter by category if needed
      let filteredRobots = robots;
      if (categoryFilter) {
        filteredRobots = robots.filter(robot => 
          robot.category && robot.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      
      // Clear container
      container.innerHTML = '';
      
      // Display filtered robots
      if (filteredRobots.length > 0) {
        const robotsGrid = document.createElement('div');
        robotsGrid.className = 'robots-grid';
        
        filteredRobots.forEach(robot => {
          const robotCard = createRobotCard(robot);
          robotsGrid.appendChild(robotCard);
        });
        
        container.appendChild(robotsGrid);
      } else {
        // No robots found
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `<h2>No robots found</h2>
                              <p>No robots matched your search criteria. Try a different category or view all robots.</p>
                              <a href="encyclopedia.html" class="btn btn-primary">View All Robots</a>`;
        container.appendChild(noResults);
      }
    })
    .catch(error => {
      console.error('Error loading robots:', error);
      container.innerHTML = `<div class="error-message">
                              <h2>Failed to load robot data</h2>
                              <p>Please try again later or contact the administrator.</p>
                            </div>`;
    });
}

/**
 * Create a robot card element
 */
function createRobotCard(robot) {
  const card = document.createElement('div');
  card.className = 'robot-card';
  
  // Set default image if none provided
  const imageUrl = robot.image || '/images/robots/placeholder.jpg';
  
  card.innerHTML = `
    <div class="robot-image">
      <img src="${imageUrl}" alt="${robot.title}">
    </div>
    <div class="robot-content">
      <h3 class="robot-title">${robot.title}</h3>
      ${robot.category ? `<div class="robot-category">${robot.category}</div>` : ''}
      <p class="robot-description">${robot.description.substring(0, 120)}...</p>
      <a href="/robot/${robot.slug}.html" class="btn btn-outline">View Details</a>
    </div>
  `;
  
  return card;
}

/**
 * Display placeholder robots if data can't be loaded
 */
function displayPlaceholderRobots(container) {
  const placeholders = [
    {
      title: 'Atlas',
      category: 'Humanoid',
      description: 'Advanced bipedal humanoid robot developed by Boston Dynamics, capable of dynamic movements and complex tasks.',
      image: '/images/robots/placeholder.jpg'
    },
    {
      title: 'Spot',
      category: 'Service',
      description: 'Agile mobile robot that navigates terrain with unprecedented mobility, designed for industrial inspection and data collection.',
      image: '/images/robots/placeholder.jpg'
    },
    {
      title: 'Pepper',
      category: 'Humanoid',
      description: 'Social humanoid robot capable of recognizing faces and basic human emotions, designed for human interaction.',
      image: '/images/robots/placeholder.jpg'
    }
  ];
  
  placeholders.forEach(robot => {
    const robotCard = document.createElement('div');
    robotCard.className = 'robot-card';
    
    robotCard.innerHTML = `
      <div class="robot-image">
        <img src="${robot.image}" alt="${robot.title}">
      </div>
      <div class="robot-content">
        <h3 class="robot-title">${robot.title}</h3>
        <div class="robot-category">${robot.category}</div>
        <p class="robot-description">${robot.description}</p>
        <a href="#" class="btn btn-outline">View Details</a>
      </div>
    `;
    
    container.appendChild(robotCard);
  });
}
