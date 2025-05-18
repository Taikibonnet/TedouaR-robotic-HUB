/**
 * Admin functionality for TedouaR Robotics Hub
 * Simplified version using localStorage for data storage
 */

// Check if user is logged in as admin
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    
    if (!isLoggedIn) {
        // Redirect to login page if not logged in
        window.location.href = 'admin-login.html';
    }
    
    return isLoggedIn;
}

// Load robots from localStorage
function loadRobots() {
    try {
        const robotsJSON = localStorage.getItem('robots_data');
        return robotsJSON ? JSON.parse(robotsJSON) : [];
    } catch (error) {
        console.error('Error loading robots from localStorage:', error);
        return [];
    }
}

// Save robots to localStorage
function saveRobots(robots) {
    try {
        localStorage.setItem('robots_data', JSON.stringify(robots));
        return true;
    } catch (error) {
        console.error('Error saving robots to localStorage:', error);
        return false;
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
function saveRobotData(robotData) {
    try {
        // Load existing robots
        const robots = loadRobots();
        
        // Find if the robot already exists
        const existingRobotIndex = robots.findIndex(r => r.slug === robotData.slug);
        
        // Update or add the robot
        if (existingRobotIndex !== -1) {
            robots[existingRobotIndex] = {
                ...robots[existingRobotIndex],
                ...robotData,
                updated_at: new Date().toISOString() // Add update timestamp
            };
        } else {
            robots.push({
                ...robotData,
                created_at: new Date().toISOString(), // Add creation timestamp
                updated_at: new Date().toISOString()  // Add update timestamp
            });
        }
        
        // Save robots
        return saveRobots(robots);
    } catch (error) {
        console.error('Error saving robot data:', error);
        alert(`Failed to save robot data: ${error.message}`);
        return false;
    }
}

// Load robots for admin management
function loadRobotsForAdmin() {
    return loadRobots();
}

// Delete robot
function deleteRobot(robotId) {
    try {
        // Load existing robots
        const robots = loadRobots();
        
        // Find the robot index
        const robotIndex = robots.findIndex(r => r.slug === robotId);
        
        if (robotIndex === -1) {
            throw new Error(`Robot with ID "${robotId}" not found`);
        }
        
        // Remove the robot
        robots.splice(robotIndex, 1);
        
        // Save robots
        const success = saveRobots(robots);
        
        return { 
            success, 
            message: success ? 'Robot deleted successfully' : 'Failed to save after deletion'
        };
    } catch (error) {
        console.error('Error deleting robot:', error);
        return { success: false, message: `Failed to delete robot: ${error.message}` };
    }
}

// Load robot for editing
function loadRobotForEditing(robotId) {
    try {
        const robots = loadRobotsForAdmin();
        
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
function displayImagePreview(imageUrl, container, isMainImage, isFromUrl = true) {
    // Clear container if it's the main image (only one allowed)
    if (isMainImage) {
        container.innerHTML = '';
    }
    
    const imageElement = document.createElement('div');
    imageElement.className = 'uploaded-image';
    
    // Get file name from URL or use a default name
    const fileName = isFromUrl 
        ? imageUrl.split('/').pop() 
        : 'Selected Image';
    
    imageElement.innerHTML = `
        <img src="${imageUrl}" alt="${fileName}">
        <div class="uploaded-image-overlay">
            <span class="image-label">${fileName}</span>
            <span class="image-delete"><i class="fas fa-trash"></i></span>
        </div>
    `;
    
    container.appendChild(imageElement);
    
    // Add event listener for delete button
    const deleteBtn = imageElement.querySelector('.image-delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            imageElement.remove();
            
            // Clear input if it's the main image
            if (isMainImage) {
                const mainImageInput = document.getElementById('main-image-url');
                if (mainImageInput) {
                    mainImageInput.value = '';
                }
            }
        });
    }
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
    
    // Set main image URL if present
    const mainImageUrl = document.getElementById('main-image-url');
    if (mainImageUrl && robot.image) {
        mainImageUrl.value = robot.image;
        displayImagePreview(robot.image, document.getElementById('main-image-preview'), true);
    }
    
    // Set gallery image URLs if present
    if (robot.gallery_images && robot.gallery_images.length > 0) {
        const galleryUrlsContainer = document.getElementById('gallery-urls-container');
        const galleryImagesPreview = document.getElementById('gallery-images-preview');
        
        // Clear existing inputs
        galleryUrlsContainer.innerHTML = '';
        galleryImagesPreview.innerHTML = '';
        
        // Display all gallery images
        robot.gallery_images.forEach((imageUrl, index) => {
            // Add input field for this gallery image
            addGalleryImageInput(imageUrl);
            
            // Display preview
            displayImagePreview(imageUrl, galleryImagesPreview, false);
        });
    }
    
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

// Add gallery image URL input field
function addGalleryImageInput(initialValue = '') {
    const galleryUrlsContainer = document.getElementById('gallery-urls-container');
    if (!galleryUrlsContainer) return;
    
    // Count existing gallery inputs
    const existingInputs = document.querySelectorAll('.gallery-url-input').length;
    
    // Maximum 5 gallery images
    if (existingInputs >= 5) {
        alert('Maximum 5 gallery images allowed.');
        return;
    }
    
    const inputRow = document.createElement('div');
    inputRow.className = 'form-row gallery-url-input';
    inputRow.innerHTML = `
        <div class="form-col">
            <div class="form-group">
                <label>Gallery Image URL ${existingInputs + 1}</label>
                <div class="url-input-group">
                    <input type="url" name="gallery-image-url[]" value="${initialValue}" placeholder="https://example.com/image.jpg">
                    <button type="button" class="btn btn-outline preview-gallery-url">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                </div>
            </div>
        </div>
        <div class="form-col" style="flex: 0 0 auto; align-self: flex-end;">
            <button type="button" class="btn btn-outline remove-gallery-url">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    galleryUrlsContainer.appendChild(inputRow);
    
    // Add event listener for remove button
    inputRow.querySelector('.remove-gallery-url').addEventListener('click', function() {
        inputRow.remove();
        updateGalleryPreviews();
    });
    
    // Add event listener for preview button
    inputRow.querySelector('.preview-gallery-url').addEventListener('click', function() {
        const urlInput = inputRow.querySelector('input[name="gallery-image-url[]"]');
        const url = urlInput.value.trim();
        
        if (url) {
            const galleryImagesPreview = document.getElementById('gallery-images-preview');
            displayImagePreview(url, galleryImagesPreview, false);
        } else {
            alert('Please enter an image URL first.');
        }
    });
    
    return inputRow;
}

// Update gallery image previews based on URL inputs
function updateGalleryPreviews() {
    const galleryImagesPreview = document.getElementById('gallery-images-preview');
    if (!galleryImagesPreview) return;
    
    // Clear existing previews
    galleryImagesPreview.innerHTML = '';
    
    // Get all gallery URL inputs
    const galleryUrls = Array.from(document.querySelectorAll('input[name="gallery-image-url[]"]'))
        .map(input => input.value)
        .filter(url => url.trim() !== '');
    
    // Display previews for each URL
    galleryUrls.forEach(url => {
        if (url.trim() !== '') {
            displayImagePreview(url, galleryImagesPreview, false);
        }
    });
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
    
    // Get main image URL
    const mainImageUrl = document.getElementById('main-image-url')?.value || '';
    
    // Get gallery image URLs
    const galleryImageUrls = Array.from(document.querySelectorAll('input[name="gallery-image-url[]"]'))
        .map(input => input.value)
        .filter(url => url.trim() !== '');
    
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
        technical_specs: techSpecs,
        image: mainImageUrl,
        gallery_images: galleryImageUrls
    };
    
    return robotData;
}

// Handle robot form submission
function handleRobotFormSubmission(form) {
    try {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;
        
        // Get robot data from form
        const robotData = getRobotDataFromForm(form);
        
        // Save robot data
        const success = saveRobotData(robotData);
        
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