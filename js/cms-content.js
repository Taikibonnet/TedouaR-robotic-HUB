// cms-content.js - Load robot data from Decap CMS content files
(function() {
  // This function loads robot data from the content files
  async function loadRobotData() {
    try {
      // Attempt to load the index of all robots
      const response = await fetch('/content/index.json');
      if (!response.ok) {
        console.warn('Robot content index not found. Using fallback demo data.');
        return window.robotsData || {}; // Use existing data if available
      }
      
      const index = await response.json();
      const robots = {};
      
      // Load each robot file
      for (const slug of index.robots) {
        try {
          const robotResponse = await fetch(`/content/robots/${slug}.json`);
          if (robotResponse.ok) {
            const robotData = await robotResponse.json();
            robots[robotData.id] = robotData;
          }
        } catch (err) {
          console.error(`Error loading robot ${slug}:`, err);
        }
      }
      
      return robots;
    } catch (err) {
      console.error('Error loading robot data:', err);
      return window.robotsData || {}; // Fallback to demo data
    }
  }
  
  // When the DOM is loaded, get robot data and make it available to the app
  document.addEventListener('DOMContentLoaded', async function() {
    try {
      // Load robot data
      const robots = await loadRobotData();
      
      // Make it available globally
      window.robotsData = robots;
      
      // Trigger initialization of pages that depend on robot data
      if (typeof window.initializeEncyclopedia === 'function' && document.querySelector('.encyclopedia-container')) {
        window.initializeEncyclopedia();
      }
      
      if (typeof window.initializeRobotDetail === 'function' && document.querySelector('.robot-detail-container')) {
        window.initializeRobotDetail();
      }
      
      // If we're on the homepage, initialize featured robots section
      const featuredRobotsSection = document.querySelector('.featured-robots');
      if (featuredRobotsSection) {
        initializeFeaturedRobots(featuredRobotsSection, robots);
      }
    } catch (err) {
      console.error('Error initializing CMS content:', err);
    }
  });
  
  // Function to initialize featured robots on the homepage
  function initializeFeaturedRobots(container, robots) {
    // Get featured robots
    const featuredRobots = Object.values(robots).filter(robot => robot.featured);
    
    // If there are no featured robots, don't do anything
    if (featuredRobots.length === 0) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Create featured robots grid
    const grid = document.createElement('div');
    grid.className = 'featured-robots-grid';
    
    // Add each featured robot
    featuredRobots.forEach(robot => {
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
      
      grid.appendChild(robotCard);
    });
    
    container.appendChild(grid);
  }
})();
