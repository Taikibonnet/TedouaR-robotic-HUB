/**
 * Enhanced Image Upload Scripts for TedouaR Robotics HUB
 * 
 * This file handles image upload functionality with IndexedDB storage for persistence
 */

// Initialize database
let db;
const dbName = "TedouaRImagesDB";
const dbVersion = 1;
const storeName = "imagesStore";

// Open IndexedDB and create object store if needed
function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(dbName, dbVersion);
        
        request.onerror = (event) => {
            console.error("Database error:", event.target.error);
            reject("Could not open database");
        };
        
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("Database opened successfully");
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object store for images
            if (!db.objectStoreNames.contains(storeName)) {
                const store = db.createObjectStore(storeName, { keyPath: "path" });
                store.createIndex("timestamp", "timestamp", { unique: false });
                store.createIndex("folder", "folder", { unique: false });
                console.log("Object store created");
            }
        };
    });
}

// Initialize image upload functionality when document is ready
document.addEventListener('DOMContentLoaded', async function() {
    // Only run on the image upload page
    if (!document.getElementById('upload-tab')) {
        return;
    }
    
    // Validate admin authentication and redirect if not logged in
    const loginData = JSON.parse(localStorage.getItem('admin_logged_in'));
    if (!loginData || !loginData.loggedIn) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Initialize database
    try {
        await initDatabase();
        console.log("Database initialized");
    } catch (error) {
        console.error("Failed to initialize database:", error);
        alert("Failed to initialize image storage. Some features may not work correctly.");
    }
    
    // Selected files
    let selectedFiles = [];
    
    // DOM Elements
    const fileInput = document.getElementById('file-input');
    const selectFilesBtn = document.getElementById('select-files-btn');
    const uploadDropzone = document.getElementById('upload-dropzone');
    const fileList = document.getElementById('file-list');
    const uploadAllBtn = document.getElementById('upload-all-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const notification = document.getElementById('notification');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const refreshLibraryBtn = document.getElementById('refresh-library');
    
    // Add sample images if store is empty
    checkAndAddSampleImages();
    
    // Click event for select files button
    if (selectFilesBtn) {
        selectFilesBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Drag and drop functionality
    if (uploadDropzone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadDropzone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadDropzone.addEventListener(eventName, function() {
                uploadDropzone.classList.add('active');
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadDropzone.addEventListener(eventName, function() {
                uploadDropzone.classList.remove('active');
            });
        });
        
        uploadDropzone.addEventListener('drop', function(e) {
            const droppedFiles = e.dataTransfer.files;
            handleFiles(droppedFiles);
        });
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
            this.value = ''; // Reset input
        });
    }
    
    // Handle files
    function handleFiles(files) {
        if (!files.length) return;
        
        // Filter for image files only
        const imageFiles = Array.from(files).filter(file => 
            file.type.match('image.*')
        );
        
        // Add files to selected files array
        imageFiles.forEach(file => {
            // Check if file already exists
            const exists = selectedFiles.some(f => 
                f.name === file.name && f.size === file.size
            );
            
            if (!exists) {
                // Add file with status
                selectedFiles.push({
                    file: file,
                    status: 'pending',
                    progress: 0
                });
            }
        });
        
        // Update file list UI
        updateFileList();
        
        // Enable upload button if files exist
        if (uploadAllBtn) {
            uploadAllBtn.disabled = selectedFiles.length === 0;
        }
    }
    
    // Update file list UI
    function updateFileList() {
        if (!fileList) return;
        
        fileList.innerHTML = '';
        
        if (selectedFiles.length === 0) {
            fileList.innerHTML = '<p style="text-align: center; color: rgba(255, 255, 255, 0.5);">No files selected</p>';
            return;
        }
        
        selectedFiles.forEach((fileObj, index) => {
            const file = fileObj.file;
            
            // Create file item element
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            // Create file preview
            const filePreview = document.createElement('div');
            filePreview.className = 'file-preview';
            
            // Create preview image if it's an image
            const img = document.createElement('img');
            const reader = new FileReader();
            
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            
            reader.readAsDataURL(file);
            filePreview.appendChild(img);
            
            // File info
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            
            const fileName = document.createElement('div');
            fileName.className = 'file-name';
            fileName.textContent = file.name;
            
            const fileSize = document.createElement('div');
            fileSize.className = 'file-size';
            fileSize.textContent = formatFileSize(file.size);
            
            const fileStatus = document.createElement('div');
            fileStatus.className = 'file-status status-' + fileObj.status;
            fileStatus.textContent = getStatusText(fileObj.status);
            
            // Progress bar
            const progressContainer = document.createElement('div');
            progressContainer.className = 'upload-progress';
            
            const progressBar = document.createElement('div');
            progressBar.className = 'upload-progress-bar';
            progressBar.style.width = fileObj.progress + '%';
            
            progressContainer.appendChild(progressBar);
            
            fileInfo.appendChild(fileName);
            fileInfo.appendChild(fileSize);
            fileInfo.appendChild(fileStatus);
            fileInfo.appendChild(progressContainer);
            
            // File actions
            const fileActions = document.createElement('div');
            fileActions.className = 'file-actions';
            
            const removeButton = document.createElement('button');
            removeButton.className = 'file-remove';
            removeButton.innerHTML = '<i class="fas fa-times"></i>';
            removeButton.title = 'Remove';
            
            removeButton.addEventListener('click', function() {
                removeFile(index);
            });
            
            fileActions.appendChild(removeButton);
            
            // Append all elements
            fileItem.appendChild(filePreview);
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(fileActions);
            
            fileList.appendChild(fileItem);
        });
    }
    
    // Remove file from selection
    function removeFile(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
        if (uploadAllBtn) {
            uploadAllBtn.disabled = selectedFiles.length === 0;
        }
    }
    
    // Format file size
    function formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
    
    // Get status text
    function getStatusText(status) {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'uploading':
                return 'Uploading...';
            case 'success':
                return 'Uploaded Successfully';
            case 'error':
                return 'Upload Failed';
            default:
                return 'Unknown';
        }
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('active');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('active');
        }, 5000);
    }
    
    // Upload all files
    if (uploadAllBtn) {
        uploadAllBtn.addEventListener('click', function() {
            if (selectedFiles.length === 0) return;
            
            // Show loading overlay
            if (loadingOverlay) {
                loadingOverlay.classList.add('active');
            }
            
            // Upload files one by one
            uploadNextFile(0);
        });
    }
    
    // Upload file
    function uploadNextFile(index) {
        if (index >= selectedFiles.length) {
            // All files uploaded
            if (loadingOverlay) {
                loadingOverlay.classList.remove('active');
            }
            showNotification('All files uploaded successfully!', 'success');
            
            // Clear selected files
            selectedFiles = [];
            updateFileList();
            if (uploadAllBtn) {
                uploadAllBtn.disabled = true;
            }
            
            // Refresh library
            loadImageLibrary();
            return;
        }
        
        const fileObj = selectedFiles[index];
        const file = fileObj.file;
        
        // Update status
        fileObj.status = 'uploading';
        updateFileList();
        
        // Convert file to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = function() {
            const base64Data = reader.result;
            
            // Sanitize filename and add timestamp
            const timestamp = new Date().getTime();
            const sanitizedName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
            const uniqueName = `${timestamp}_${sanitizedName}`;
            
            // Determine folder based on file type
            let folder = 'uploads';
            if (file.name.toLowerCase().includes('robot')) {
                folder = 'robots';
            }
            
            // Save to IndexedDB
            persistImage(base64Data, folder, uniqueName, index);
        };
    }
    
    // Save image to IndexedDB
    function persistImage(dataUrl, folder, filename, index) {
        if (!db) {
            showNotification('Database not available. Please refresh the page.', 'error');
            return;
        }
        
        const fileObj = selectedFiles[index];
        const path = `images/${folder}/${filename}`;
        
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        
        const image = {
            path: path,
            url: dataUrl,
            name: filename,
            folder: folder,
            timestamp: new Date().getTime()
        };
        
        const request = store.add(image);
        
        request.onsuccess = function() {
            console.log("Image added to database:", path);
            
            // Update status and progress
            fileObj.progress = 100;
            fileObj.status = 'success';
            updateFileList();
            
            // Move to next file
            setTimeout(() => {
                uploadNextFile(index + 1);
            }, 500);
        };
        
        request.onerror = function(event) {
            console.error("Error adding image to database:", event.target.error);
            
            fileObj.status = 'error';
            updateFileList();
            
            showNotification(`Failed to save image: ${filename}`, 'error');
            
            // Move to next file
            setTimeout(() => {
                uploadNextFile(index + 1);
            }, 1000);
        };
        
        // Progress simulation for UI feedback
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 5;
            
            if (progress > 90) {
                clearInterval(progressInterval);
            } else {
                fileObj.progress = progress;
                updateFileList();
            }
        }, 50);
    }
    
    // Load image library from IndexedDB
    function loadImageLibrary() {
        const imageLibrary = document.getElementById('image-library');
        if (!imageLibrary) return;
        
        // Show loading state
        imageLibrary.innerHTML = '<div class="loading" style="text-align: center; padding: 20px; color: rgba(255, 255, 255, 0.6);"><i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i> Loading images...</div>';
        
        if (!db) {
            imageLibrary.innerHTML = '<p style="text-align: center; color: rgba(255, 255, 255, 0.5);">Database not available. Please refresh the page.</p>';
            return;
        }
        
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const images = [];
        
        const request = store.openCursor();
        
        request.onsuccess = function(event) {
            const cursor = event.target.result;
            
            if (cursor) {
                images.push(cursor.value);
                cursor.continue();
            } else {
                // No more images, display them
                displayImagesInLibrary(images, imageLibrary);
            }
        };
        
        request.onerror = function(event) {
            console.error("Error loading images:", event.target.error);
            imageLibrary.innerHTML = '<p style="text-align: center; color: rgba(255, 255, 255, 0.5);">Error loading images. Please try again.</p>';
        };
    }
    
    // Display images in the library
    function displayImagesInLibrary(images, container) {
        if (!images || images.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: rgba(255, 255, 255, 0.5);">No images uploaded yet. Use the upload tab to add images.</p>';
            return;
        }
        
        // Group images by folder
        const imagesByFolder = {};
        
        images.forEach(image => {
            const folder = image.folder || 'uploads'; // Default to uploads if folder is not set
            
            if (!imagesByFolder[folder]) {
                imagesByFolder[folder] = [];
            }
            
            imagesByFolder[folder].push(image);
        });
        
        // Clear container
        container.innerHTML = '';
        
        // Display images by folder
        Object.keys(imagesByFolder).forEach(folder => {
            const folderImages = imagesByFolder[folder];
            
            // Sort images by timestamp (newest first)
            folderImages.sort((a, b) => b.timestamp - a.timestamp);
            
            // Create folder section
            const folderSection = document.createElement('div');
            folderSection.className = 'folder-section';
            
            // Create folder header
            const folderHeader = document.createElement('h3');
            folderHeader.textContent = folder.charAt(0).toUpperCase() + folder.slice(1); // Capitalize first letter
            folderHeader.style.marginTop = '20px';
            folderHeader.style.marginBottom = '15px';
            folderHeader.style.color = 'rgba(255, 255, 255, 0.9)';
            
            folderSection.appendChild(folderHeader);
            
            // Create image grid
            const imageGrid = document.createElement('div');
            imageGrid.className = 'image-library';
            
            // Add images to grid
            folderImages.forEach(image => {
                const imageItem = createImageItem(image);
                imageGrid.appendChild(imageItem);
            });
            
            folderSection.appendChild(imageGrid);
            container.appendChild(folderSection);
        });
    }
    
    // Create image item for library
    function createImageItem(image) {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        // Create image
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.name;
        img.loading = 'lazy';
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        
        // Create image name
        const imageName = document.createElement('div');
        imageName.className = 'image-name';
        
        // Use the original filename without timestamp prefix
        let displayName = image.name;
        if (displayName.includes('_')) {
            // Remove timestamp prefix if it exists
            displayName = displayName.split('_').slice(1).join('_');
        }
        
        imageName.textContent = displayName;
        
        overlay.appendChild(imageName);
        
        // Create URL field for copying
        const urlField = document.createElement('input');
        urlField.type = 'text';
        urlField.className = 'image-url-field';
        urlField.value = image.url;
        urlField.id = `url-${image.path.replace(/[^a-z0-9]/gi, '-')}`;
        
        // Create actions
        const actions = document.createElement('div');
        actions.className = 'image-actions';
        
        // Copy URL button
        const copyButton = document.createElement('div');
        copyButton.className = 'image-action';
        copyButton.innerHTML = '<i class="fas fa-link"></i>';
        copyButton.title = 'Copy URL';
        
        copyButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Copy URL to clipboard
            const urlField = document.getElementById(`url-${image.path.replace(/[^a-z0-9]/gi, '-')}`);
            urlField.select();
            document.execCommand('copy');
            
            // Show success message
            const copySuccess = document.createElement('div');
            copySuccess.className = 'copy-success';
            copySuccess.textContent = 'URL copied!';
            
            this.appendChild(copySuccess);
            copySuccess.classList.add('active');
            
            setTimeout(() => {
                copySuccess.classList.remove('active');
                setTimeout(() => {
                    this.removeChild(copySuccess);
                }, 300);
            }, 2000);
        });
        
        // Delete button
        const deleteButton = document.createElement('div');
        deleteButton.className = 'image-action delete';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.title = 'Delete';
        
        deleteButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (confirm(`Are you sure you want to delete ${displayName}?`)) {
                // Delete image from IndexedDB
                deleteImage(image.path);
                
                // Remove element from DOM
                imageItem.remove();
                
                // Show notification
                showNotification(`Deleted ${displayName}`, 'success');
            }
        });
        
        actions.appendChild(copyButton);
        actions.appendChild(deleteButton);
        
        // Add event listeners
        imageItem.addEventListener('click', function() {
            // Preview image
            window.open(image.url, '_blank');
        });
        
        // Append elements
        imageItem.appendChild(img);
        imageItem.appendChild(overlay);
        imageItem.appendChild(urlField);
        imageItem.appendChild(actions);
        
        return imageItem;
    }
    
    // Delete image from IndexedDB
    function deleteImage(path) {
        if (!db) return;
        
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        
        const request = store.delete(path);
        
        request.onsuccess = function() {
            console.log("Image deleted from database:", path);
        };
        
        request.onerror = function(event) {
            console.error("Error deleting image:", event.target.error);
            showNotification("Failed to delete image. Please try again.", "error");
        };
    }
    
    // Check if store is empty and add sample images if needed
    async function checkAndAddSampleImages() {
        if (!db) return;
        
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        
        const countRequest = store.count();
        
        countRequest.onsuccess = function() {
            const count = countRequest.result;
            
            if (count === 0) {
                // Store is empty, add sample images
                addSampleImages();
            }
        };
    }
    
    // Add sample images to IndexedDB
    function addSampleImages() {
        // Default image (hero robot from the site)
        const defaultImageUrl = 'https://raw.githubusercontent.com/Taikibonnet/TedouaR-robotic-HUB/main/images/hero-robot.png';
        
        // Fetch the default image
        fetch(defaultImageUrl)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                
                reader.onload = function() {
                    const base64Data = reader.result;
                    
                    // Sample images data
                    const sampleImages = [
                        {
                            path: 'images/uploads/sample_upload_1.jpg',
                            url: base64Data,
                            name: 'sample_upload_1.jpg',
                            folder: 'uploads',
                            timestamp: new Date().getTime() - 86400000 // Yesterday
                        },
                        {
                            path: 'images/uploads/sample_upload_2.jpg',
                            url: base64Data,
                            name: 'sample_upload_2.jpg',
                            folder: 'uploads',
                            timestamp: new Date().getTime() - 172800000 // 2 days ago
                        },
                        {
                            path: 'images/robots/robot_1.jpg',
                            url: base64Data,
                            name: 'robot_1.jpg',
                            folder: 'robots',
                            timestamp: new Date().getTime() - 259200000 // 3 days ago
                        },
                        {
                            path: 'images/robots/robot_2.jpg',
                            url: base64Data,
                            name: 'robot_2.jpg',
                            folder: 'robots',
                            timestamp: new Date().getTime() - 345600000 // 4 days ago
                        }
                    ];
                    
                    // Add sample images to IndexedDB
                    const transaction = db.transaction([storeName], "readwrite");
                    const store = transaction.objectStore(storeName);
                    
                    sampleImages.forEach(image => {
                        store.add(image);
                    });
                    
                    console.log("Sample images added to database");
                };
            })
            .catch(error => {
                console.error("Error fetching default image:", error);
            });
    }
    
    // Tab switching
    if (tabs.length && tabContents.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current tab and content
                this.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');
                
                // If switching to library tab, load images
                if (tabId === 'library') {
                    loadImageLibrary();
                }
            });
        });
    }
    
    // Refresh library button
    if (refreshLibraryBtn) {
        refreshLibraryBtn.addEventListener('click', function() {
            loadImageLibrary();
        });
    }
    
    // If on library tab, load images
    if (document.querySelector('.tab[data-tab="library"]')?.classList.contains('active')) {
        loadImageLibrary();
    }
});
