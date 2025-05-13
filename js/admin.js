/**
 * Admin functionality for TedouaR Robotics Hub
 * Enhanced with GitHub API integration for permanent storage
 */

// GitHub repository information
const GITHUB_REPO = {
    owner: 'taikibonnet',
    repo: 'TedouaR-robotic-HUB',
    branch: 'main'
};

// Personal access token for GitHub API
// Note: In a production environment, this would be stored securely server-side
// For demo purposes, we'll use localStorage for temporary storage
let GITHUB_TOKEN = localStorage.getItem('github_token');

// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com';

// Check if user is logged in as admin
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    
    if (!isLoggedIn) {
        // Redirect to login page if not logged in
        window.location.href = 'admin-login.html';
    }
    
    return isLoggedIn;
}

// GitHub API helpers
async function getGitHubFile(path) {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/contents/${path}?ref=${GITHUB_REPO.branch}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to get file: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error getting GitHub file:', error);
        throw error;
    }
}

async function updateGitHubFile(path, content, message, sha = null) {
    try {
        const payload = {
            message: message,
            content: btoa(content), // Base64 encode content
            branch: GITHUB_REPO.branch
        };
        
        if (sha) {
            payload.sha = sha;
        }
        
        const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update file: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating GitHub file:', error);
        throw error;
    }
}

async function uploadImageToGitHub(file, directory = 'images/robots') {
    try {
        // Generate a safe filename
        const timestamp = new Date().getTime();
        const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFilename = `${timestamp}-${safeFilename}`;
        const path = `${directory}/${uniqueFilename}`;
        
        // Read file as binary
        const reader = new FileReader();
        const fileContent = await new Promise((resolve, reject) => {
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(e);
            reader.readAsDataURL(file);
        });
        
        // Extract base64 content from data URL
        const base64Content = fileContent.split(',')[1];
        
        // Upload to GitHub
        const payload = {
            message: `Upload image: ${uniqueFilename}`,
            content: base64Content,
            branch: GITHUB_REPO.branch
        };
        
        const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to upload image: ${response.statusText}`);
        }
        
        const data = await response.json();
        return path;
    } catch (error) {
        console.error('Error uploading image to GitHub:', error);
        throw error;
    }
}

// Process image for upload
async function processImageUpload(file) {
    // Validate file
    if (!validateImageFile(file)) {
        throw new Error('Invalid image file');
    }
    
    // Upload to GitHub
    const filePath = await uploadImageToGitHub(file);
    
    return filePath;
}

// Validate image file
function validateImageFile(file) {
    // Check if file exists
    if (!file) return false;
    
    // Check file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, etc.).');
        return false;
    }
    
    // Check file size (max 2MB - GitHub API limit for files is 100MB but we'll be conservative)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
        alert('File size too large. Please select an image under 2MB.');
        return false;
    }
    
    return true;
}

// Load robots from GitHub
async function loadRobotsFromGitHub() {
    try {
        const file = await getGitHubFile('robots.json');
        const content = atob(file.content); // Base64 decode content
        const robots = JSON.parse(content);
        return {
            robots,
            sha: file.sha
        };
    } catch (error) {
        console.error('Error loading robots from GitHub:', error);
        throw error;
    }
}

// Save robots to GitHub
async function saveRobotsToGitHub(robots, sha) {
    try {
        const content = JSON.stringify(robots, null, 2);
        return await updateGitHubFile('robots.json', content, 'Update robots.json', sha);
    } catch (error) {
        console.error('Error saving robots to GitHub:', error);
        throw error;
    }
}

// Generate slug from title
function generateSlug(title) {
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();                  // Trim whitespace
}

// Save robot data
async function saveRobotData(robotData, mainImageFile, galleryImageFiles) {
    try {
        // Load existing robots
        const { robots, sha } = await loadRobotsFromGitHub();
        
        // Find if the robot already exists
        const existingRobotIndex = robots.findIndex(r => r.slug === robotData.slug);
        
        // Process main image if provided
        if (mainImageFile) {
            const mainImagePath = await processImageUpload(mainImageFile);
            robotData.image = mainImagePath;
        }
        
        // Process gallery images if provided
        let galleryImagePaths = robotData.gallery_images || [];
        if (galleryImageFiles && galleryImageFiles.length > 0) {
            const newGalleryImagePaths = [];
            
            for (let i = 0; i < Math.min(galleryImageFiles.length, 5); i++) {
                const file = galleryImageFiles[i];
                const path = await processImageUpload(file);
                newGalleryImagePaths.push(path);
            }
            
            // Combine existing and new gallery images
            robotData.gallery_images = [...galleryImagePaths, ...newGalleryImagePaths].slice(0, 5);
        }
        
        // Update or add the robot
        if (existingRobotIndex !== -1) {
            robots[existingRobotIndex] = {
                ...robots[existingRobotIndex],
                ...robotData
            };
        } else {
            robots.push(robotData);
        }
        
        // Save to GitHub
        await saveRobotsToGitHub(robots, sha);
        
        return true;
    } catch (error) {
        console.error('Error saving robot data:', error);
        return false;
    }
}

// Load robots for admin management
async function loadRobotsForAdmin() {
    try {
        const { robots } = await loadRobotsFromGitHub();
        return robots;
    } catch (error) {
        console.error('Error loading robots:', error);
        throw error;
    }
}

// Delete robot
async function deleteRobot(robotId) {
    try {
        // Load existing robots
        const { robots, sha } = await loadRobotsFromGitHub();
        
        // Find the robot index
        const robotIndex = robots.findIndex(r => r.slug === robotId);
        
        if (robotIndex === -1) {
            throw new Error(`Robot with ID "${robotId}" not found`);
        }
        
        // Remove the robot
        robots.splice(robotIndex, 1);
        
        // Save to GitHub
        await saveRobotsToGitHub(robots, sha);
        
        return { success: true, message: 'Robot deleted successfully' };
    } catch (error) {
        console.error('Error deleting robot:', error);
        return { success: false, message: 'Failed to delete robot' };
    }
}

// Load robot for editing
async function loadRobotForEditing(robotId) {
    try {
        const robots = await loadRobotsForAdmin();
        
        // Find the robot by ID (slug)
        const robot = robots.find(r => r.slug === robotId);
        
        if (!robot) {
            throw new Error(`Robot with ID "${robotId}" not found`);
        }
        
        return robot;
    } catch (error) {
        console.error('Error loading robot for editing:', error);
        throw error;
    }
}

// Display image preview in form
function displayImagePreview(file, container, isMainImage) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageElement = document.createElement('div');
        imageElement.className = 'uploaded-image';
        
        // Clear container if it's the main image (only one allowed)
        if (isMainImage) {
            container.innerHTML = '';
        }
        
        imageElement.innerHTML = `
            <img src="${e.target.result}" alt="${file.name}">
            <div class="uploaded-image-overlay">
                <span class="image-label">${file.name}</span>
                <span class="image-delete"><i class="fas fa-trash"></i></span>
            </div>
        `;
        
        container.appendChild(imageElement);
        
        // Add event listener for delete button
        const deleteBtn = imageElement.querySelector('.image-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                imageElement.remove();
                
                // Clear file input if it's the main image
                if (isMainImage) {
                    document.getElementById('main-image-input').value = '';
                }
            });
        }
    };
    
    reader.readAsDataURL(file);
}

// Fill robot form with data
function fillRobotForm(robot) {
    document.getElementById('robot-title').value = robot.title || '';
    document.getElementById('robot-slug').value = robot.slug || '';
    document.getElementById('robot-manufacturer').value = robot.manufacturer || '';
    document.getElementById('robot-category').value = robot.category || '';
    document.getElementById('robot-description').value = robot.description || '';
    document.getElementById('robot-featured').value = robot.featured ? 'true' : 'false';
    document.getElementById('robot-tags').value = robot.tags ? robot.tags.join(', ') : '';
    document.getElementById('robot-content').value = robot.content || '';
    document.getElementById('robot-video').value = robot.video_url || '';
    document.getElementById('robot-additional-video').value = robot.additional_video_url || '';
    
    // Fill technical specifications
    if (robot.technical_specs) {
        const techSpecsContainer = document.getElementById('tech-specs-container');
        techSpecsContainer.innerHTML = ''; // Clear default row
        
        Object.entries(robot.technical_specs).forEach(([name, value]) => {
            const newSpecRow = document.createElement('div');
            newSpecRow.className = 'form-row tech-spec-row';
            newSpecRow.innerHTML = `
                <div class="form-col">
                    <div class="form-group">
                        <label>Specification Name</label>
                        <input type="text" name="spec-name[]" value="${name}" placeholder="e.g., Height, Weight, etc.">
                    </div>
                </div>
                <div class="form-col">
                    <div class="form-group">
                        <label>Specification Value</label>
                        <input type="text" name="spec-value[]" value="${value}" placeholder="e.g., 5 ft 8 in (1.73 meters)">
                    </div>
                </div>
            `;
            
            techSpecsContainer.appendChild(newSpecRow);
        });
        
        // Add empty row if no specs
        if (Object.keys(robot.technical_specs).length === 0) {
            addEmptySpecRow(techSpecsContainer);
        }
    } else {
        // Add empty row
        const techSpecsContainer = document.getElementById('tech-specs-container');
        techSpecsContainer.innerHTML = ''; // Clear default row
        addEmptySpecRow(techSpecsContainer);
    }
    
    // Show existing images
    if (robot.image) {
        const mainImagePreview = document.getElementById('main-image-preview');
        mainImagePreview.innerHTML = `
            <div class="uploaded-image">
                <img src="${robot.image}" alt="${robot.title}">
                <div class="uploaded-image-overlay">
                    <span class="image-label">Current Main Image</span>
                    <span class="image-delete" data-image-type="main"><i class="fas fa-trash"></i></span>
                </div>
            </div>
        `;
        
        // Add event listener for delete button
        const deleteBtn = mainImagePreview.querySelector('.image-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                mainImagePreview.innerHTML = '';
            });
        }
    }
    
    // Show gallery images
    if (robot.gallery_images && robot.gallery_images.length > 0) {
        const galleryImagesPreview = document.getElementById('gallery-images-preview');
        galleryImagesPreview.innerHTML = '';
        
        robot.gallery_images.forEach((image, index) => {
            const imageElement = document.createElement('div');
            imageElement.className = 'uploaded-image';
            imageElement.innerHTML = `
                <img src="${image}" alt="${robot.title} Gallery Image ${index + 1}">
                <div class="uploaded-image-overlay">
                    <span class="image-label">Gallery Image ${index + 1}</span>
                    <span class="image-delete" data-image-type="gallery" data-image-index="${index}"><i class="fas fa-trash"></i></span>
                </div>
            `;
            
            galleryImagesPreview.appendChild(imageElement);
            
            // Add event listener for delete button
            const deleteBtn = imageElement.querySelector('.image-delete');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    imageElement.remove();
                });
            }
        });
    }
}

// Add empty specification row
function addEmptySpecRow(container) {
    const newSpecRow = document.createElement('div');
    newSpecRow.className = 'form-row tech-spec-row';
    newSpecRow.innerHTML = `
        <div class="form-col">
            <div class="form-group">
                <label>Specification Name</label>
                <input type="text" name="spec-name[]" placeholder="e.g., Height, Weight, etc.">
            </div>
        </div>
        <div class="form-col">
            <div class="form-group">
                <label>Specification Value</label>
                <input type="text" name="spec-value[]" placeholder="e.g., 5 ft 8 in (1.73 meters)">
            </div>
        </div>
    `;
    
    container.appendChild(newSpecRow);
}

// Get form data for robot
function getRobotDataFromForm(form) {
    const formData = new FormData(form);
    
    // Get technical specifications
    const techSpecs = {};
    const specNames = document.querySelectorAll('input[name="spec-name[]"]');
    const specValues = document.querySelectorAll('input[name="spec-value[]"]');
    
    for (let i = 0; i < specNames.length; i++) {
        const name = specNames[i].value.trim();
        const value = specValues[i].value.trim();
        
        if (name && value) {
            techSpecs[name] = value;
        }
    }
    
    // Get tags and convert to array
    const tagsString = formData.get('tags');
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    // Create robot data object
    const robotData = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        category: formData.get('category'),
        manufacturer: formData.get('manufacturer'),
        description: formData.get('description'),
        featured: formData.get('featured') === 'true',
        tags: tags,
        content: formData.get('content'),
        video_url: formData.get('video_url'),
        additional_video_url: formData.get('additional_video_url'),
        technical_specs: techSpecs
    };
    
    return robotData;
}

// Handle robot form submission
async function handleRobotFormSubmission(form) {
    try {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;
        
        // Get robot data from form
        const robotData = getRobotDataFromForm(form);
        
        // Get image files
        const mainImageInput = document.getElementById('main-image-input');
        const galleryImagesInput = document.getElementById('gallery-images-input');
        
        const mainImageFile = mainImageInput.files[0];
        const galleryImageFiles = galleryImagesInput.files;
        
        // Save robot data
        const success = await saveRobotData(robotData, mainImageFile, galleryImageFiles);
        
        // Restore button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        if (success) {
            alert('Robot has been saved successfully!');
            window.location.href = 'admin-panel.html';
        } else {
            alert('Failed to save robot data. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting robot form:', error);
        alert('An error occurred while saving the robot. Please try again.');
        
        // Restore button state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Robot';
        submitBtn.disabled = false;
    }
}

// Initialize GitHub authentication
async function initGitHubAuth() {
    // Get token from localStorage or prompt user
    if (!GITHUB_TOKEN) {
        GITHUB_TOKEN = prompt('Please enter your GitHub Personal Access Token to enable admin functionality:');
        
        if (GITHUB_TOKEN) {
            localStorage.setItem('github_token', GITHUB_TOKEN);
        } else {
            alert('GitHub token is required for admin functionality. Please try again.');
            window.location.href = 'index.html';
        }
    }
}

// On page load, initialize GitHub auth if admin is logged in
if (localStorage.getItem('admin_logged_in') === 'true') {
    initGitHubAuth();
}