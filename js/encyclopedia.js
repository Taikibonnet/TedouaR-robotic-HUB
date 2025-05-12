/**
 * Encyclopedia JavaScript
 * This script handles the loading and displaying of robot entries from robots.json
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the home page with the robot-grid
  const robotGrid = document.querySelector('.robot-grid');
  if (robotGrid) {
    loadFeaturedRobots(robotGrid);
  }
  
  // Check if we're on the encyclopedia page - this will look for either class or the entire section
  const encyclopediaContainer = document.querySelector('.encyclopedia-container');
  if (encyclopediaContainer) {
    const robotGridInEncyclopedia = encyclopediaContainer.querySelector('.robot-grid');
    if (robotGridInEncyclopedia) {
      loadAllRobots(robotGridInEncyclopedia);
    }
  }
});

/**
 * Load featured robots for the home page
 */
function loadFeaturedRobots(container) {
  // Fetch the list of robot entries from robots.json
  fetch('robots.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load robot data');
      }
      return response.json();
    })
    .then(robots => {
      // Filter featured robots or just take the first 3 if featured not specified
      let featuredRobots = robots.filter(robot => robot.featured === true);
      if (featuredRobots.length === 0) {
        featuredRobots = robots.slice(0, 3);
      }
      
      // Display the robots
      container.innerHTML = ''; // Clear container first
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
  fetch('robots.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load robot data');
      }
      return response.json();
    })
    .then(robots => {
      // Filter by category if needed
      let filteredRobots = robots;
      if (categoryFilter && categoryFilter !== 'all') {
        filteredRobots = robots.filter(robot => 
          robot.category && robot.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      
      // Clear container
      container.innerHTML = '';
      
      // Display filtered robots
      if (filteredRobots.length > 0) {
        filteredRobots.forEach(robot => {
          const robotCard = createRobotCard(robot);
          container.appendChild(robotCard);
        });
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
  const imageUrl = robot.image || 'images/robots/placeholder.jpg';
  
  // Prepare truncated description
  const truncatedDescription = robot.description.length > 120 ? 
    robot.description.substring(0, 120) + '...' : 
    robot.description;
  
  // Set manufacturer info if available
  const manufacturerInfo = robot.manufacturer ? 
    `<div class="robot-manufacturer">${robot.manufacturer}</div>` : '';
  
  card.innerHTML = `
    <a href="#" class="robot-card-link">
      <div class="robot-card-image">
        <img src="${imageUrl}" alt="${robot.title}">
      </div>
      <div class="robot-card-content">
        <div class="robot-card-header">
          <h3 class="robot-card-title">${robot.title}</h3>
          <div class="robot-card-categories">
            ${robot.category ? `<span class="category-pill">${robot.category}</span>` : ''}
          </div>
        </div>
        ${manufacturerInfo}
        <p class="robot-card-description">${truncatedDescription}</p>
      </div>
    </a>
  `;
  
  // Add event listener to the card to show modal with details
  card.querySelector('.robot-card-link').addEventListener('click', function(e) {
    e.preventDefault();
    showRobotDetails(robot);
  });
  
  return card;
}

/**
 * Show robot details in a modal
 */
function showRobotDetails(robot) {
  // Create modal element if it doesn't exist
  let modal = document.getElementById('robot-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'robot-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    // Add event listener to close when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Add event listener for ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }
  
  // Set modal content
  const imageUrl = robot.image || 'images/robots/placeholder.jpg';
  const videoEmbed = robot.video_url ? 
    `<div class="robot-video">
      <iframe width="100%" height="315" src="${robot.video_url}" frameborder="0" allowfullscreen></iframe>
    </div>` : '';
  
  // Create technical specs HTML if available
  let techSpecsHtml = '';
  if (robot.technical_specs) {
    techSpecsHtml = '<div class="robot-specs"><h3>Technical Specifications</h3><ul>';
    for (const [key, value] of Object.entries(robot.technical_specs)) {
      // Convert snake_case to Title Case
      const formattedKey = key.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      techSpecsHtml += `<li><strong>${formattedKey}:</strong> ${value}</li>`;
    }
    techSpecsHtml += '</ul></div>';
  }
  
  // Create tags HTML if available
  let tagsHtml = '';
  if (robot.tags && robot.tags.length > 0) {
    tagsHtml = '<div class="robot-tags">';
    robot.tags.forEach(tag => {
      tagsHtml += `<span class="tag">${tag}</span>`;
    });
    tagsHtml += '</div>';
  }
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button" onclick="closeModal()">&times;</span>
      <div class="robot-header">
        <h2 class="robot-title">${robot.title}</h2>
        ${robot.manufacturer ? `<div class="robot-manufacturer">${robot.manufacturer}</div>` : ''}
        ${robot.category ? `<div class="robot-category">${robot.category}</div>` : ''}
        ${tagsHtml}
      </div>
      
      <div class="robot-content-grid">
        <div class="robot-image-container">
          <img src="${imageUrl}" alt="${robot.title}" class="robot-main-image">
          ${videoEmbed}
        </div>
        
        <div class="robot-content-container">
          <div class="robot-description">
            <p>${robot.description}</p>
          </div>
          
          ${techSpecsHtml}
          
          <div class="robot-body">
            ${robot.content ? '<div class="robot-detailed-content">' + formatContent(robot.content) + '</div>' : ''}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Show the modal
  modal.classList.add('active');
  document.body.classList.add('modal-open');
}

/**
 * Format content text with paragraphs
 */
function formatContent(content) {
  // Split by newlines and wrap each paragraph in <p> tags
  return content.split('\n\n')
    .filter(para => para.trim() !== '')
    .map(para => `<p>${para}</p>`)
    .join('');
}

/**
 * Close the robot details modal
 */
function closeModal() {
  const modal = document.getElementById('robot-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
}

// Add to global scope for onclick handler
window.closeModal = closeModal;

/**
 * Display placeholder robots if data can't be loaded
 */
function displayPlaceholderRobots(container) {
  const placeholders = [
    {
      title: 'Atlas',
      category: 'Humanoid',
      manufacturer: 'Boston Dynamics',
      description: 'Advanced bipedal humanoid robot developed by Boston Dynamics, capable of dynamic movements and complex tasks.',
      image: 'images/robots/placeholder.jpg'
    },
    {
      title: 'Spot',
      category: 'Service',
      manufacturer: 'Boston Dynamics',
      description: 'Agile mobile robot that navigates terrain with unprecedented mobility, designed for industrial inspection and data collection.',
      image: 'images/robots/placeholder.jpg'
    },
    {
      title: 'Pepper',
      category: 'Humanoid',
      manufacturer: 'SoftBank Robotics',
      description: 'Social humanoid robot capable of recognizing faces and basic human emotions, designed for human interaction.',
      image: 'images/robots/placeholder.jpg'
    }
  ];
  
  container.innerHTML = ''; // Clear container first
  
  placeholders.forEach(robot => {
    const robotCard = createRobotCard(robot);
    container.appendChild(robotCard);
  });
}