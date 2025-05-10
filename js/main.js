// main.js - General website functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
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
                        
                        // Simulate AI response
                        const responses = [
                            "I can help you explore our robot encyclopedia. What kind of robots are you interested in?",
                            "The TedouaR Robotics Hub features industrial, humanoid, and service robots. Would you like to learn more about a specific category?",
                            "You can find detailed specifications, applications, and videos for each robot in our encyclopedia.",
                            "I'm here to assist with any robotics-related questions you might have.",
                            "You can browse robots by category or search for specific models in our encyclopedia."
                        ];
                        
                        // Select random response
                        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                        addMessage(randomResponse);
                    }, 1500); // Simulate thinking time
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
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
});