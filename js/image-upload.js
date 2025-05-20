    // Delete uploaded image from local storage
    function deleteUploadedImage(path) {
        // Get existing uploaded images
        const uploadedImages = JSON.parse(localStorage.getItem('uploaded_images')) || [];
        
        // Filter out the deleted image
        const filteredImages = uploadedImages.filter(img => img.path !== path);
        
        // Save back to local storage
        localStorage.setItem('uploaded_images', JSON.stringify(filteredImages));
    }
    
    // Add sample images if none exist
    function addSampleImages() {
        const uploadedImages = JSON.parse(localStorage.getItem('uploaded_images')) || [];
        
        if (uploadedImages.length === 0) {
            // Use a default image for samples
            const defaultImage = 'https://raw.githubusercontent.com/Taikibonnet/TedouaR-robotic-HUB/main/images/hero-robot.png';
            
            // Sample images
            const sampleImages = [
                {
                    path: 'images/uploads/sample_upload_1.jpg',
                    url: defaultImage,
                    name: 'sample_upload_1.jpg',
                    timestamp: new Date().getTime() - 86400000 // Yesterday
                },
                {
                    path: 'images/uploads/sample_upload_2.jpg',
                    url: defaultImage,
                    name: 'sample_upload_2.jpg',
                    timestamp: new Date().getTime() - 172800000 // 2 days ago
                },
                {
                    path: 'images/robots/robot_1.jpg',
                    url: defaultImage,
                    name: 'robot_1.jpg',
                    timestamp: new Date().getTime() - 259200000 // 3 days ago
                },
                {
                    path: 'images/robots/robot_2.jpg',
                    url: defaultImage,
                    name: 'robot_2.jpg',
                    timestamp: new Date().getTime() - 345600000 // 4 days ago
                }
            ];
            
            // Save to local storage
            localStorage.setItem('uploaded_images', JSON.stringify(sampleImages));
        }
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
