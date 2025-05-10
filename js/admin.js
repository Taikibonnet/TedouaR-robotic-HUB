// TedouaR Robotics Hub - Admin JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated as admin
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const isAdminPage = window.location.pathname.includes('/admin/');
    
    if (isAdminPage && !isAdminLoggedIn) {
        // Redirect to login page if not authenticated
        window.location.href = '../login.html?redirect=admin';
        return;
    }
    
    // Robot Management
    const addRobotBtn = document.getElementById('add-robot-btn');
    const robotModal = document.getElementById('robot-modal');
    const deleteModal = document.getElementById('delete-modal');
    const cancelRobotBtn = document.getElementById('cancel-robot-btn');
    const saveRobotBtn = document.getElementById('save-robot-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const robotSearch = document.getElementById('robot-search');
    const deleteButtons = document.querySelectorAll('.delete-icon');
    const viewButtons = document.querySelectorAll('.view-icon');
    const addSpecBtn = document.getElementById('add-spec-btn');
    const addApplicationBtn = document.getElementById('add-application-btn');
    const specsContainer = document.getElementById('specs-container');
    const applicationsContainer = document.getElementById('applications-container');
    
    // Robot data storage (simulating a database)
    let robotsData = {
        'spot': {
            id: 'spot',
            name: 'Spot',
            manufacturer: 'Boston Dynamics',
            description: 'An agile mobile robot that navigates terrain with unprecedented mobility, allowing you to automate routine inspection tasks and data capture safely.',
            details: 'Spot is designed to go where wheeled robots cannot, while carrying payloads with endurance far beyond aerial drones. With 360° vision and obstacle avoidance, Spot can be driven remotely or taught routes to follow autonomously.',
            categories: ['industrial', 'quadruped'],
            status: 'published',
            image: '../images/robots/spot.jpg',
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
            videos: ['https://www.youtube.com/watch?v=wlkCQXHEgjA']
        },
        'atlas': {
            id: 'atlas',
            name: 'Atlas',
            manufacturer: 'Boston Dynamics',
            description: 'Atlas is the most dynamic humanoid robot in the world, designed to navigate rough terrain and perform complex physical tasks.',
            details: 'Atlas uses its whole body, including legs, arms, and torso, to perform tasks, just like a human would. It can manipulate the world by using its hands to lift, carry, and toss heavy objects.',
            categories: ['humanoid', 'research'],
            status: 'published',
            image: '../images/robots/atlas.jpg',
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
            videos: ['https://www.youtube.com/watch?v=_sBBaNYex3E']
        }
    };
    
    // Open robot modal when Add Robot button is clicked
    if (addRobotBtn) {
        addRobotBtn.addEventListener('click', function() {
            openRobotModal();
        });
    }
    
    // Close modals when Cancel or X button is clicked
    if (cancelRobotBtn) {
        cancelRobotBtn.addEventListener('click', function() {
            closeRobotModal();
        });
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            closeDeleteModal();
        });
    }
    
    if (modalCloseButtons.length > 0) {
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeRobotModal();
                closeDeleteModal();
            });
        });
    }
    
    // Handle robot search
    if (robotSearch) {
        robotSearch.addEventListener('keyup', function() {
            const searchTerm = this.value.trim().toLowerCase();
            const robotRows = document.querySelectorAll('.robot-table tbody tr');
            
            robotRows.forEach(row => {
                const robotName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const robotManufacturer = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                const robotCategories = row.querySelector('.category-pills').textContent.toLowerCase();
                
                if (robotName.includes(searchTerm) || 
                    robotManufacturer.includes(searchTerm) || 
                    robotCategories.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Add new specification row
    if (addSpecBtn && specsContainer) {
        addSpecBtn.addEventListener('click', function() {
            addSpecRow();
        });
        
        // Add event delegation for remove spec buttons
        specsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-spec-btn') || e.target.closest('.remove-spec-btn')) {
                const specRow = e.target.closest('.spec-row');
                if (specRow) {
                    specRow.remove();
                }
            }
        });
    }
    
    // Add new application row
    if (addApplicationBtn && applicationsContainer) {
        addApplicationBtn.addEventListener('click', function() {
            addApplicationRow();
        });
        
        // Add event delegation for remove application buttons
        applicationsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-application-btn') || e.target.closest('.remove-application-btn')) {
                const applicationRow = e.target.closest('.application-row');
                if (applicationRow) {
                    applicationRow.remove();
                }
            }
        });
    }
    
    // Handle file input styling
    const fileInputs = document.querySelectorAll('.file-input');
    if (fileInputs.length > 0) {
        fileInputs.forEach(input => {
            const display = input.nextElementSibling;
            const browseBtn = display.querySelector('.file-input-btn');
            const textDisplay = display.querySelector('.file-input-text');
            
            // Open file browser when clicking anywhere on the display area
            display.addEventListener('click', function() {
                input.click();
            });
            
            // Handle file selection
            input.addEventListener('change', function() {
                if (input.files.length > 0) {
                    textDisplay.textContent = input.files[0].name;
                } else {
                    textDisplay.textContent = 'Choose a file or drag it here';
                }
            });
            
            // Handle drag and drop
            display.addEventListener('dragover', function(e) {
                e.preventDefault();
                display.classList.add('dragover');
            });
            
            display.addEventListener('dragleave', function() {
                display.classList.remove('dragover');
            });
            
            display.addEventListener('drop', function(e) {
                e.preventDefault();
                display.classList.remove('dragover');
                
                if (e.dataTransfer.files.length > 0) {
                    input.files = e.dataTransfer.files;
                    textDisplay.textContent = e.dataTransfer.files[0].name;
                }
            });
        });
    }
    
    // Save robot data
    if (saveRobotBtn) {
        saveRobotBtn.addEventListener('click', function() {
            saveRobot();
        });
    }
    
    // Delete robot handler
    if (deleteButtons.length > 0) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const robotId = this.getAttribute('data-id');
                openDeleteModal(robotId);
            });
        });
    }
    
    // Confirm delete robot
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            deleteRobot();
        });
    }
    
    // View robot details
    if (viewButtons.length > 0) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const robotId = this.getAttribute('data-id');
                window.open(`../robot-detail.html?id=${robotId}`, '_blank');
            });
        });
    }
    
    // Check if we're on the robot edit page
    const urlParams = new URLSearchParams(window.location.search);
    const editRobotId = urlParams.get('id');
    
    if (window.location.pathname.includes('robot-edit.html') && editRobotId) {
        // Load robot data for editing
        loadRobotForEditing(editRobotId);
    }
    
    // Function to open robot modal
    function openRobotModal(robotData = null) {
        // Reset form
        document.getElementById('robot-form').reset();
        
        // Clear existing specs and applications
        if (specsContainer) {
            specsContainer.innerHTML = '';
            addSpecRow();
        }
        
        if (applicationsContainer) {
            applicationsContainer.innerHTML = '';
            addApplicationRow();
        }
        
        // Set modal title
        const modalTitle = document.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = robotData ? 'Edit Robot' : 'Add New Robot';
        }
        
        // If editing, populate form with robot data
        if (robotData) {
            document.getElementById('robot-name').value = robotData.name;
            document.getElementById('robot-manufacturer').value = robotData.manufacturer;
            document.getElementById('robot-description').value = robotData.description;
            document.getElementById('robot-details').value = robotData.details || '';
            document.getElementById('robot-status').value = robotData.status;
            
            // Select categories
            const categorySelect = document.getElementById('robot-categories');
            if (categorySelect) {
                for (let i = 0; i < categorySelect.options.length; i++) {
                    categorySelect.options[i].selected = robotData.categories.includes(categorySelect.options[i].value);
                }
            }
            
            // Add specs
            if (specsContainer && robotData.specs && robotData.specs.length > 0) {
                specsContainer.innerHTML = '';
                robotData.specs.forEach(spec => {
                    addSpecRow(spec.label, spec.value);
                });
            }
            
            // Add applications
            if (applicationsContainer && robotData.applications && robotData.applications.length > 0) {
                applicationsContainer.innerHTML = '';
                robotData.applications.forEach(app => {
                    addApplicationRow(app.name, app.description);
                });
            }
            
            // Add videos
            if (robotData.videos && robotData.videos.length > 0) {
                document.getElementById('robot-videos').value = robotData.videos.join('\n');
            }
        }
        
        // Show modal
        if (robotModal) {
            robotModal.style.display = 'flex';
        }
    }
    
    // Function to close robot modal
    function closeRobotModal() {
        if (robotModal) {
            robotModal.style.display = 'none';
        }
    }
    
    // Function to open delete confirmation modal
    function openDeleteModal(robotId) {
        if (deleteModal) {
            const robot = robotsData[robotId] || { name: 'this robot' };
            document.getElementById('delete-robot-name').textContent = robot.name;
            deleteModal.setAttribute('data-robot-id', robotId);
            deleteModal.style.display = 'flex';
        }
    }
    
    // Function to close delete confirmation modal
    function closeDeleteModal() {
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }
    }
    
    // Function to add a new specification row
    function addSpecRow(label = '', value = '') {
        if (!specsContainer) return;
        
        const specRow = document.createElement('div');
        specRow.className = 'spec-row';
        specRow.innerHTML = `
            <input type="text" name="spec-label[]" class="form-control" placeholder="Label (e.g., Height)" value="${label}">
            <input type="text" name="spec-value[]" class="form-control" placeholder="Value (e.g., 1.5m)" value="${value}">
            <button type="button" class="remove-spec-btn"><i class="fas fa-times"></i></button>
        `;
        
        specsContainer.appendChild(specRow);
    }
    
    // Function to add a new application row
    function addApplicationRow(name = '', description = '') {
        if (!applicationsContainer) return;
        
        const applicationRow = document.createElement('div');
        applicationRow.className = 'application-row';
        applicationRow.innerHTML = `
            <input type="text" name="application[]" class="form-control" placeholder="Application (e.g., Industrial Inspection)" value="${name}">
            <textarea name="application-desc[]" class="form-control" rows="2" placeholder="Description">${description}</textarea>
            <button type="button" class="remove-application-btn"><i class="fas fa-times"></i></button>
        `;
        
        applicationsContainer.appendChild(applicationRow);
    }
    
    // Function to save robot data
    function saveRobot() {
        // Get form data
        const form = document.getElementById('robot-form');
        if (!form) return;
        
        const name = document.getElementById('robot-name').value.trim();
        const manufacturer = document.getElementById('robot-manufacturer').value.trim();
        const description = document.getElementById('robot-description').value.trim();
        const details = document.getElementById('robot-details').value.trim();
        const status = document.getElementById('robot-status').value;
        
        // Validate required fields
        if (!name || !manufacturer || !description) {
            showNotification('Please fill out all required fields.', 'error');
            return;
        }
        
        // Generate an ID from the name
        const id = name.toLowerCase().replace(/\s+/g, '-');
        
        // Get selected categories
        const categorySelect = document.getElementById('robot-categories');
        const categories = [];
        if (categorySelect) {
            for (let i = 0; i < categorySelect.options.length; i++) {
                if (categorySelect.options[i].selected) {
                    categories.push(categorySelect.options[i].value);
                }
            }
        }
        
        // Get specifications
        const specs = [];
        const specLabels = form.querySelectorAll('input[name="spec-label[]"]');
        const specValues = form.querySelectorAll('input[name="spec-value[]"]');
        
        for (let i = 0; i < specLabels.length; i++) {
            const label = specLabels[i].value.trim();
            const value = specValues[i].value.trim();
            
            if (label && value) {
                specs.push({ label, value });
            }
        }
        
        // Get applications
        const applications = [];
        const applicationNames = form.querySelectorAll('input[name="application[]"]');
        const applicationDescs = form.querySelectorAll('textarea[name="application-desc[]"]');
        
        for (let i = 0; i < applicationNames.length; i++) {
            const name = applicationNames[i].value.trim();
            const description = applicationDescs[i].value.trim();
            
            if (name) {
                applications.push({ name, description });
            }
        }
        
        // Get videos
        const videosText = document.getElementById('robot-videos').value;
        const videos = videosText ? videosText.split('\n').filter(url => url.trim()) : [];
        
        // Create robot object
        const robot = {
            id,
            name,
            manufacturer,
            description,
            details,
            categories,
            status,
            specs,
            applications,
            videos,
            image: '../images/robots/placeholder.jpg' // Placeholder image
        };
        
        // Handle image upload (in a real implementation, this would upload to a server)
        const imageInput = document.getElementById('robot-image');
        if (imageInput && imageInput.files.length > 0) {
            // In a real implementation, this would be an AJAX call to upload the file
            // For this demo, we'll just simulate a successful upload
            const file = imageInput.files[0];
            // Here we'd normally upload the file and get back a URL
            robot.image = `../images/robots/${id}.jpg`;
        }
        
        // Save robot data (in a real implementation, this would be an API call)
        robotsData[id] = robot;
        
        // Close modal
        closeRobotModal();
        
        // Show success notification
        showNotification(`Robot "${name}" has been saved successfully.`, 'success');
        
        // Reload page after a short delay
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
    
    // Function to delete a robot
    function deleteRobot() {
        if (!deleteModal) return;
        
        const robotId = deleteModal.getAttribute('data-robot-id');
        if (!robotId) return;
        
        // Delete robot (in a real implementation, this would be an API call)
        const robotName = robotsData[robotId] ? robotsData[robotId].name : 'Robot';
        delete robotsData[robotId];
        
        // Close modal
        closeDeleteModal();
        
        // Show success notification
        showNotification(`Robot "${robotName}" has been deleted successfully.`, 'success');
        
        // Reload page after a short delay
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
    
    // Function to load robot data for editing
    function loadRobotForEditing(robotId) {
        // In a real implementation, this would be an API call to get the robot data
        const robot = robotsData[robotId];
        
        if (robot) {
            // Populate form with robot data
            openRobotModal(robot);
        } else {
            // Robot not found
            showNotification('Robot not found.', 'error');
        }
    }
    
    // Function to display notification
    function showNotification(message, type) {
        // Check if notification container exists, create if not
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add close button
        const closeButton = document.createElement('span');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', function() {
            notification.remove();
        });
        notification.appendChild(closeButton);
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            notification.remove();
        }, 5000);
    }
    
    // Dashboard chart (if we're on the dashboard page)
    if (window.location.pathname.includes('dashboard.html')) {
        // This would normally use a charting library like Chart.js
        // For this demo, we'll just create a placeholder
        console.log('Dashboard loaded');
    }
});

// Add CSS for modals
document.addEventListener('DOMContentLoaded', function() {
    // Create a style element
    const style = document.createElement('style');
    
    // Define modal styles
    style.textContent = `
        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1050;
            justify-content: center;
            align-items: center;
            overflow-y: auto;
            padding: 20px;
        }
        
        .modal-content {
            background-color: var(--dark-2);
            border-radius: 10px;
            width: 100%;
            max-width: 800px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
            position: relative;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
        }
        
        .modal-close {
            font-size: 1.5rem;
            cursor: pointer;
            line-height: 1;
            color: var(--gray);
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: var(--primary);
        }
        
        .modal-body {
            padding: 20px;
            overflow-y: auto;
            max-height: calc(90vh - 130px);
        }
        
        .modal-footer {
            padding: 15px 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        /* Form styling for modals */
        .form-row {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .form-row .form-group {
            flex: 1;
        }
        
        .spec-row, .application-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            align-items: flex-start;
        }
        
        .spec-row input:first-child {
            width: 40%;
        }
        
        .spec-row input:nth-child(2) {
            width: 40%;
        }
        
        .application-row input {
            width: 30%;
        }
        
        .application-row textarea {
            width: 50%;
        }
        
        .remove-spec-btn, .remove-application-btn {
            width: 30px;
            height: 30px;
            border-radius: 4px;
            background-color: rgba(255, 107, 107, 0.1);
            color: var(--accent);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .remove-spec-btn:hover, .remove-application-btn:hover {
            background-color: rgba(255, 107, 107, 0.2);
        }
        
        .file-input-container {
            position: relative;
        }
        
        .file-input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            z-index: -1;
        }
        
        .file-input-display {
            border: 2px dashed rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }
        
        .file-input-display:hover, .file-input-display.dragover {
            border-color: var(--primary);
            background-color: rgba(32, 227, 178, 0.05);
        }
        
        .file-input-text {
            color: var(--gray);
        }
        
        /* Status badges */
        .status-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .status-badge.active {
            background-color: rgba(76, 175, 80, 0.1);
            color: #4caf50;
        }
        
        .status-badge.draft {
            background-color: rgba(255, 152, 0, 0.1);
            color: #ff9800;
        }
        
        .status-badge.pending {
            background-color: rgba(33, 150, 243, 0.1);
            color: #2196f3;
        }
        
        /* Category pills */
        .category-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }
        
        .category-pill {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 0.75rem;
            background-color: rgba(32, 227, 178, 0.1);
            color: var(--primary);
        }
        
        /* Danger button */
        .btn-danger {
            background-color: #f44336;
            color: white;
            border: none;
        }
        
        .btn-danger:hover {
            background-color: #d32f2f;
        }
    `;
    
    // Append style to head
    document.head.appendChild(style);
});
