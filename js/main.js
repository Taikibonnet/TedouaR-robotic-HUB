// main.js - General website functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            if (authButtons) {
                authButtons.classList.toggle('mobile-active');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-links') && 
                !event.target.closest('.mobile-menu-button') && 
                !event.target.closest('.auth-buttons')) {
                if (navLinks.classList.contains('mobile-active')) {
                    navLinks.classList.remove('mobile-active');
                    if (authButtons) {
                        authButtons.classList.remove('mobile-active');
                    }
                }
            }
        });
    }
    
    // Admin User Dropdown
    const adminDropdownToggle = document.getElementById('admin-dropdown-toggle');
    const adminDropdownMenu = document.getElementById('admin-dropdown-menu');
    
    if (adminDropdownToggle && adminDropdownMenu) {
        // Toggle dropdown
        adminDropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            adminDropdownMenu.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('#admin-dropdown-toggle') && 
                !event.target.closest('#admin-dropdown-menu')) {
                if (adminDropdownMenu.classList.contains('active')) {
                    adminDropdownMenu.classList.remove('active');
                }
            }
        });
        
        // Admin link handler
        const adminLink = document.querySelector('#admin-dropdown-menu .admin-link');
        if (adminLink) {
            adminLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'admin/';
            });
        }
    }
    
    // AI Assistant Chat Interface
    const aiButton = document.getElementById('ai-button');
    const aiChatContainer = document.getElementById('ai-chat-container');
    const aiChatClose = document.getElementById('ai-chat-close');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiMessages = document.getElementById('ai-chat-messages');
    
    if (aiButton && aiChatContainer) {
        // Toggle chat interface
        aiButton.addEventListener('click', function() {
            aiChatContainer.classList.add('active');
        });
        
        // Close chat interface
        if (aiChatClose) {
            aiChatClose.addEventListener('click', function() {
                aiChatContainer.classList.remove('active');
            });
        }
        
        // Send message functionality
        if (aiInput && aiSend && aiMessages) {
            // Function to add message to chat
            function addMessage(content, isUser = false) {
                const messageDiv = document.createElement('div');
                messageDiv.className = isUser ? 'ai-message user-message' : 'ai-message';
                
                const avatarDiv = document.createElement('div');
                avatarDiv.className = isUser ? 'ai-avatar user-avatar' : 'ai-avatar';
                
                const icon = document.createElement('i');
                icon.className = isUser ? 'fas fa-user' : 'fas fa-robot';
                avatarDiv.appendChild(icon);
                
                const bubbleDiv = document.createElement('div');
                bubbleDiv.className = isUser ? 'ai-bubble user-bubble' : 'ai-bubble';
                bubbleDiv.textContent = content;
                
                messageDiv.appendChild(avatarDiv);
                messageDiv.appendChild(bubbleDiv);
                
                aiMessages.appendChild(messageDiv);
                
                // Scroll to bottom
                aiMessages.scrollTop = aiMessages.scrollHeight;
                
                return messageDiv;
            }
            
            // Function to show typing indicator
            function showTypingIndicator() {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'ai-message';
                messageDiv.id = 'typing-message';
                
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'ai-avatar';
                
                const icon = document.createElement('i');
                icon.className = 'fas fa-robot';
                avatarDiv.appendChild(icon);
                
                const bubbleDiv = document.createElement('div');
                bubbleDiv.className = 'ai-bubble';
                
                const indicator = document.createElement('div');
                indicator.className = 'typing-indicator';
                
                for (let i = 0; i < 3; i++) {
                    const dot = document.createElement('span');
                    indicator.appendChild(dot);
                }
                
                bubbleDiv.appendChild(indicator);
                
                messageDiv.appendChild(avatarDiv);
                messageDiv.appendChild(bubbleDiv);
                
                aiMessages.appendChild(messageDiv);
                
                // Scroll to bottom
                aiMessages.scrollTop = aiMessages.scrollHeight;
                
                return messageDiv;
            }
            
            // Function to remove typing indicator
            function removeTypingIndicator() {
                const typingMessage = document.getElementById('typing-message');
                if (typingMessage) {
                    typingMessage.remove();
                }
            }
            
            // Function to handle sending a message
            function sendMessage() {
                const message = aiInput.value.trim();
                
                if (message) {
                    // Add user message
                    addMessage(message, true);
                    
                    // Clear input
                    aiInput.value = '';
                    
                    // Show typing indicator
                    const typingIndicator = showTypingIndicator();
                    
                    // Simulate AI response (would be replaced with actual AI processing)
                    setTimeout(() => {
                        // Remove typing indicator
                        removeTypingIndicator();
                        
                        // Process the message to generate appropriate response
                        let response = getAIResponse(message);
                        addMessage(response);
                    }, 1500); // Simulate thinking time
                }
            }
            
            // Function to generate contextual responses
            function getAIResponse(message) {
                // Convert message to lowercase for easier matching
                const lowerMessage = message.toLowerCase();
                
                // Check for specific keywords to provide contextual responses
                if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
                    return "Hello there! How can I help you with robotics today?";
                } 
                else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
                    return "I'm the TedouaR Robotics HUB assistant, designed to help you navigate our platform and learn about robotics.";
                }
                else if (lowerMessage.includes('login') || lowerMessage.includes('sign in') || lowerMessage.includes('account')) {
                    return "You can create an account or log in using the buttons in the top-right corner of the page. This will give you access to exclusive content and community features.";
                }
                else if (lowerMessage.includes('robot') && (lowerMessage.includes('type') || lowerMessage.includes('kind') || lowerMessage.includes('category'))) {
                    return "We cover many types of robots including industrial robots, humanoid robots, service robots, consumer robots, and more. You can browse them all in our encyclopedia.";
                }
                else if (lowerMessage.includes('industrial') && lowerMessage.includes('robot')) {
                    return "Industrial robots are automated, programmable machines used in manufacturing. They perform tasks like welding, assembly, and packaging. Check our encyclopedia for specific industrial robot models.";
                }
                else if (lowerMessage.includes('humanoid')) {
                    return "Humanoid robots are designed to resemble and mimic human movement and interaction. Examples include Boston Dynamics' Atlas and SoftBank's Pepper. You can explore them in our encyclopedia section.";
                }
                else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
                    return "You can contact the TedouaR Robotics team through our Contact page. We're always happy to hear from robotics enthusiasts!";
                }
                else if (lowerMessage.includes('thank')) {
                    return "You're welcome! Is there anything else I can help you with?";
                }
                else if (lowerMessage.includes('admin') || lowerMessage.includes('dashboard')) {
                    return "If you have administrator access, you can access the admin dashboard by clicking your profile in the top-right corner and selecting 'Admin'.";
                }
                else {
                    // Default responses if no specific matches
                    const responses = [
                        "I can help you explore our robot encyclopedia. What kind of robots are you interested in?",
                        "The TedouaR Robotics Hub features industrial, humanoid, and service robots. Would you like to learn more about a specific category?",
                        "You can find detailed specifications, applications, and videos for each robot in our encyclopedia.",
                        "I'm here to assist with any robotics-related questions you might have.",
                        "You can browse robots by category or search for specific models in our encyclopedia."
                    ];
                    
                    // Select random response
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
            
            // Send message on button click
            aiSend.addEventListener('click', sendMessage);
            
            // Send message on Enter key
            aiInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('mobile-active')) {
                    navLinks.classList.remove('mobile-active');
                    if (authButtons) {
                        authButtons.classList.remove('mobile-active');
                    }
                }
            }
        });
    });
});