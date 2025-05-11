// TedouaR Robotics Hub - Admin JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated as admin
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const isAdminPage = window.location.pathname.includes('/admin/');
    
    if (isAdminPage && !isAdminLoggedIn) {
        // We're on an admin page but not logged in
        // Check if we're on the Decap CMS admin index page
        if (window.location.pathname.endsWith('/admin/') || window.location.pathname.endsWith('/admin/index.html')) {
            // This is the Decap CMS page, allow access
            console.log('Loading Decap CMS admin interface');
        } else {
            // Redirect to login page if not authenticated
            window.location.href = '../login.html?redirect=admin';
            return;
        }
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
    
    // Check if we're on the traditional admin panel
    if (window.location.pathname.includes('/admin/') && 
        !window.location.pathname.endsWith('/admin/') && 
        !window.location.pathname.endsWith('/admin/index.html')) {
        
        // Add a button to redirect to the new Decap CMS admin
        const topBar = document.querySelector('.top-bar');
        if (topBar) {
            const cmsButton = document.createElement('a');
            cmsButton.href = '../admin/';
            cmsButton.className = 'btn btn-primary';
            cmsButton.innerHTML = '<i class="fas fa-pencil-alt"></i> Open New CMS Editor';
            cmsButton.style.marginLeft = 'auto';
            cmsButton.style.marginRight = '20px';
            
            // Insert before the user info
            const userInfo = topBar.querySelector('.user-info');
            if (userInfo) {
                topBar.insertBefore(cmsButton, userInfo);
            } else {
                topBar.appendChild(cmsButton);
            }
            
            // Add a notification about the new CMS
            showNotification('We\'ve added a new content management system! Click "Open New CMS Editor" to try it.', 'info', 10000);
        }
    }
    
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
            if (!display) return;
            
            const textDisplay = display.querySelector('.file-input-text');
            if (!textDisplay) return;
            
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
        const form = document.getElementById('robot-form');
        if (!form) return;
        
        form.reset();
        
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
            
            if (document.getElementById('robot-details')) {
                document.getElementById('robot-details').value = robotData.details || '';
            }
            
            if (document.getElementById('robot-status')) {
                document.getElementById('robot-status').value = robotData.status || 'published';
            }
            
            // Select categories
            const categorySelect = document.getElementById('robot-categories');
            if (categorySelect && robotData.categories) {
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
            if (robotData.videos && robotData.videos.length > 0 && document.getElementById('robot-videos')) {
                document.getElementById('robot-videos').value = robotData.videos.map(v => v.url).join('\n');
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
            const robotsData = window.robotsData || {};
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
        // Show notification that we're redirecting to the new CMS
        showNotification(`We're now using a new content management system. Redirecting you to the new editor...`, 'info');
        
        // Redirect to the new CMS after a short delay
        setTimeout(() => {
            window.location.href = '../admin/';
        }, 2000);
        
        return;
    }
    
    // Function to delete a robot
    function deleteRobot() {
        // Show notification that we're redirecting to the new CMS
        showNotification(`We're now using a new content management system. Redirecting you to the new editor...`, 'info');
        
        // Redirect to the new CMS after a short delay
        setTimeout(() => {
            window.location.href = '../admin/';
        }, 2000);
        
        return;
    }
    
    // Function to load robot data for editing
    function loadRobotForEditing(robotId) {
        // In a real implementation, this would be an API call to get the robot data
        const robotsData = window.robotsData || {};
        const robot = robotsData[robotId];
        
        if (robot) {
            // Populate form with robot data
            document.getElementById('robot-name').value = robot.name || '';
            document.getElementById('robot-manufacturer').value = robot.manufacturer || '';
            document.getElementById('robot-description').value = robot.description || '';
            
            if (document.getElementById('robot-details')) {
                document.getElementById('robot-details').value = robot.details || '';
            }
            
            // Update page title
            const editTitle = document.getElementById('edit-title');
            if (editTitle) {
                editTitle.textContent = `Edit Robot: ${robot.name}`;
            }
            
            // Set preview image if available
            const imagePreview = document.getElementById('robot-image-preview');
            if (imagePreview && robot.image) {
                imagePreview.src = robot.image.startsWith('../') ? robot.image : `../${robot.image}`;
            }
            
            // Add specs
            if (specsContainer && robot.specs && robot.specs.length > 0) {
                specsContainer.innerHTML = '';
                robot.specs.forEach(spec => {
                    addSpecRow(spec.label, spec.value);
                });
            } else if (specsContainer) {
                // Add a default empty row
                addSpecRow();
            }
            
            // Add applications
            if (applicationsContainer && robot.applications && robot.applications.length > 0) {
                applicationsContainer.innerHTML = '';
                robot.applications.forEach(app => {
                    addApplicationRow(app.name, app.description);
                });
            } else if (applicationsContainer) {
                // Add a default empty row
                addApplicationRow();
            }
            
            // Add videos
            const robotVideos = document.getElementById('robot-videos');
            if (robotVideos && robot.videos && robot.videos.length > 0) {
                robotVideos.value = robot.videos.map(v => v.url || v).join('\n');
            }
            
            // Select categories
            const categorySelect = document.getElementById('robot-categories');
            if (categorySelect && robot.categories) {
                for (let i = 0; i < categorySelect.options.length; i++) {
                    categorySelect.options[i].selected = robot.categories.includes(categorySelect.options[i].value);
                }
            }
            
            // Set status
            const statusSelect = document.getElementById('robot-status');
            if (statusSelect && robot.status) {
                statusSelect.value = robot.status;
            }
        } else {
            // Robot not found, show error
            showNotification('Robot not found. Redirecting to robots page...', 'error');
            
            // Redirect to robots page after a short delay
            setTimeout(() => {
                window.location.href = 'robots.html';
            }, 1500);
        }
    }
    
    // Function to display notification
    function showNotification(message, type, duration = 5000) {
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
        
        // Auto-remove after specified duration
        setTimeout(function() {
            notification.remove();
        }, duration);
    }
    
    // Dashboard chart (if we're on the dashboard page)
    if (window.location.pathname.includes('dashboard.html')) {
        // Add a notification about using the new CMS
        showNotification('We\'ve added a new content management system! Click "Open New CMS Editor" to try it.', 'info', 10000);
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
        
        /* Notification styling */
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .notification {
            background-color: #242424;
            border-left: 4px solid var(--primary);
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation: slideIn 0.3s ease-out;
            position: relative;
            width: 100%;
        }
        
        .notification.success {
            border-left-color: #4caf50;
        }
        
        .notification.error {
            border-left-color: #f44336;
        }
        
        .notification.info {
            border-left-color: #2196f3;
        }
        
        .notification.warning {
            border-left-color: #ff9800;
        }
        
        .notification-close {
            font-size: 1.2rem;
            line-height: 1;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            margin-left: 10px;
            transition: color 0.3s ease;
        }
        
        .notification-close:hover {
            color: white;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    // Append style to head
    document.head.appendChild(style);
});
