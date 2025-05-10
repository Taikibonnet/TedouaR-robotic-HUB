// TedouaR Robotics Hub - Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Get the contact form element
    const contactForm = document.getElementById('contact-form');
    
    // Check if we're on the contact page
    if (contactForm) {
        // Add submit event listener to the form
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission
            
            // Get form field values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill out all fields.', 'error');
                return;
            }
            
            // Email validation using a simple regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // In a real implementation, you would send this data to your server
            // Here, we'll just simulate a successful submission
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate server request with a timeout
            setTimeout(function() {
                // Reset the form
                contactForm.reset();
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                // Show success message
                showNotification('Your message has been sent successfully. We\'ll get back to you soon!', 'success');
            }, 1500);
        });
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
    
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        // Initialize - hide all answers except the first one
        faqItems.forEach((item, index) => {
            const answer = item.querySelector('.faq-answer');
            const question = item.querySelector('.faq-question');
            const icon = question.querySelector('.faq-icon i');
            
            // Style the first item as active
            if (index === 0) {
                item.classList.add('active');
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0px';
            }
            
            // Add click event to question
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                    const faqAnswer = faqItem.querySelector('.faq-answer');
                    const faqIcon = faqItem.querySelector('.faq-icon i');
                    
                    faqAnswer.style.maxHeight = '0px';
                    faqIcon.classList.remove('fa-minus');
                    faqIcon.classList.add('fa-plus');
                });
                
                // Toggle the clicked item
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                }
            });
        });
    }
});

// Add CSS for notifications
document.addEventListener('DOMContentLoaded', function() {
    // Create a style element
    const style = document.createElement('style');
    
    // Define notification styles
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .notification {
            min-width: 300px;
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out forwards;
            position: relative;
            padding-right: 35px;
        }
        
        .notification.success {
            background-color: #4caf50;
        }
        
        .notification.error {
            background-color: #f44336;
        }
        
        .notification.info {
            background-color: #2196f3;
        }
        
        .notification-close {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            font-size: 20px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
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
