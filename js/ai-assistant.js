// ai-assistant.js - Implementation of the AI chatbot assistant

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AI Assistant functionality
    initAIAssistant();
});

function initAIAssistant() {
    const aiButton = document.getElementById('ai-button');
    const aiChatContainer = document.getElementById('ai-chat-container');
    const aiChatClose = document.getElementById('ai-chat-close');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiMessages = document.getElementById('ai-chat-messages');
    
    if (!aiButton || !aiChatContainer || !aiChatClose || !aiInput || !aiSend || !aiMessages) {
        return; // Required elements not found
    }
    
    // Define AI knowledge base for robotics
    const knowledgeBase = {
        // General robotics questions
        "what is a robot": "A robot is a programmable machine that can carry out complex actions automatically. Modern robots can sense their environment, make decisions, and perform tasks with varying levels of autonomy.",
        
        "types of robots": "Robots can be categorized in many ways: industrial robots (for manufacturing), service robots (for assisting humans), social robots (for interaction), medical robots (for healthcare), exploration robots (for hazardous environments), humanoid robots (human-like shape), and more.",
        
        "robot components": "Robots typically consist of several key components: a control system (the 'brain'), sensors (to perceive the environment), actuators (motors and other devices that create movement), power supply, and end-effectors (tools or grippers for manipulation).",
        
        "how do robots work": "Robots work by following a sense-think-act cycle. They sense their environment using various sensors, process this information to make decisions, and then act using motors and other actuators. This process is controlled by algorithms and software that can range from simple pre-programmed instructions to complex AI systems.",
        
        "robot sensors": "Robots use many types of sensors, including cameras (vision), microphones (sound), tactile sensors (touch), proximity sensors, inertial measurement units (IMU), LIDAR (light detection and ranging), encoders (for joint positions), and many more specialized sensors.",
        
        "robot programming": "Robots can be programmed in various ways, from direct coding in languages like Python, C++, or specialized robot programming languages, to teaching by demonstration where humans physically guide the robot through tasks, to modern AI approaches like reinforcement learning where robots learn from trial and error.",
        
        // Robot applications
        "industrial robots": "Industrial robots are used in manufacturing for tasks like welding, painting, assembly, pick and place, product inspection, and testing. They operate with high precision, speed, and repeatability in structured environments.",
        
        "service robots": "Service robots assist humans in various non-manufacturing tasks, such as cleaning (robot vacuums), delivery (in hospitals or warehouses), agriculture (harvesting robots), and customer service (information robots in retail or public spaces).",
        
        "medical robots": "Medical robots assist in surgeries (like the Da Vinci Surgical System), rehabilitation, patient care, drug delivery, and hospital logistics. They can enhance precision in procedures and assist healthcare workers with repetitive tasks.",
        
        "space robots": "Space robots include Mars rovers (like Curiosity and Perseverance), the International Space Station's robotic arm (Canadarm), and various satellites with robotic capabilities. These robots extend human reach into the cosmos and perform tasks in environments too harsh for humans.",
        
        "household robots": "Household robots include robot vacuums (like Roomba), lawn mowers, window cleaners, and personal assistant robots. These robots help automate common household chores and are becoming increasingly common in homes worldwide.",
        
        // Specific robot information
        "what is atlas": "Atlas is a humanoid robot developed by Boston Dynamics. It stands about 1.5 meters tall, weighs around 80kg, and can perform dynamic movements like parkour, backflips, and complex navigation through difficult terrain. It's one of the most advanced humanoid robots in terms of mobility and balance.",
        
        "what is spot": "Spot is a quadruped (four-legged) robot developed by Boston Dynamics. It's about the size of a large dog and can navigate difficult terrain that wheeled robots can't handle. Spot is used for tasks like industrial inspection, construction monitoring, and public safety applications.",
        
        "what is nao": "NAO is a small humanoid robot developed by SoftBank Robotics (formerly Aldebaran Robotics). Standing 58cm tall, it's widely used in education and research. NAO has 25 degrees of freedom, can recognize faces and objects, and is programmable for a variety of interactions.",
        
        // Advanced robotics topics
        "what is artificial intelligence in robotics": "AI in robotics refers to the use of machine learning, neural networks, and other AI techniques to enable robots to perceive their environment, learn from experience, make decisions, and adapt to new situations. This can include computer vision for object recognition, natural language processing for human-robot interaction, and reinforcement learning for skill acquisition.",
        
        "what is robot navigation": "Robot navigation refers to how robots move safely and efficiently through their environment. It involves localization (knowing where the robot is), mapping (building a representation of the environment), path planning (finding efficient routes), and obstacle avoidance. Techniques range from simple rule-based approaches to complex SLAM (Simultaneous Localization and Mapping) algorithms.",
        
        "what is a collaborative robot": "Collaborative robots, or cobots, are designed to work alongside humans safely. Unlike traditional industrial robots that operate in caged areas, cobots have built-in safety features like force sensors that detect unexpected contact and immediately stop movement. They're typically easier to program and more flexible than traditional industrial robots.",
        
        // TedouaR Hub specific information
        "what is tedouar": "TedouaR is a robotics hub dedicated to providing comprehensive information about various types of robots. Our encyclopedia features detailed specifications, applications, and multimedia content for robots ranging from industrial manipulators to humanoid research platforms.",
        
        "how to use encyclopedia": "To use our encyclopedia, navigate to the Encyclopedia page from the main menu. You can browse all robots, filter by category, search for specific robots, or sort the listing. Click on any robot card to view detailed information, including specifications, applications, videos, and discussion.",
        
        "robot categories": "Our encyclopedia organizes robots into several categories including industrial, humanoid, service, consumer, space, and quadruped robots. You can filter the encyclopedia by these categories to find robots that match your interests."
    };
    
    // Open chat when AI button is clicked
    aiButton.addEventListener('click', function() {
        aiChatContainer.classList.add('active');
    });
    
    // Close chat when close button is clicked
    aiChatClose.addEventListener('click', function() {
        aiChatContainer.classList.remove('active');
    });
    
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
    
    // Function to get AI response
    function getAIResponse(userMessage) {
        userMessage = userMessage.toLowerCase().trim();
        
        // Check for direct matches in knowledge base
        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (userMessage.includes(key)) {
                return value;
            }
        }
        
        // If no direct match, try to provide a relevant response
        if (userMessage.includes('robot') && userMessage.includes('what')) {
            return knowledgeBase['what is a robot'];
        }
        
        if (userMessage.includes('type') || userMessage.includes('kind') || userMessage.includes('category')) {
            return knowledgeBase['types of robots'];
        }
        
        if (userMessage.includes('component') || userMessage.includes('part') || userMessage.includes('built')) {
            return knowledgeBase['robot components'];
        }
        
        if (userMessage.includes('work') || userMessage.includes('function') || userMessage.includes('operate')) {
            return knowledgeBase['how do robots work'];
        }
        
        if (userMessage.includes('atlas')) {
            return knowledgeBase['what is atlas'];
        }
        
        if (userMessage.includes('spot')) {
            return knowledgeBase['what is spot'];
        }
        
        if (userMessage.includes('nao')) {
            return knowledgeBase['what is nao'];
        }
        
        if (userMessage.includes('encyclopedia') || userMessage.includes('find') || userMessage.includes('search')) {
            return knowledgeBase['how to use encyclopedia'];
        }
        
        if (userMessage.includes('tedouar')) {
            return knowledgeBase['what is tedouar'];
        }
        
        // Default responses for various common inputs
        if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
            return "Hello! I'm the TedouaR Robotics Hub assistant. How can I help you with robotics today?";
        }
        
        if (userMessage.includes('thank')) {
            return "You're welcome! Feel free to ask if you have more questions about robotics.";
        }
        
        if (userMessage.includes('bye') || userMessage.includes('goodbye')) {
            return "Goodbye! Feel free to return if you have more robotics questions.";
        }
        
        // Generic responses when no match is found
        const genericResponses = [
            "I'm sorry, I don't have specific information on that. Would you like to know about types of robots, robot components, or how to use our encyclopedia?",
            "I'm not sure about that. You might find more information by browsing our robot encyclopedia. Would you like me to tell you how to use it?",
            "That's an interesting question! While I don't have a specific answer, you can explore our encyclopedia for detailed information on various robots.",
            "I'm still learning about that topic. Can I help you with information about our featured robots like Atlas, Spot, or NAO instead?",
            "I don't have detailed information on that yet. Would you like to know about industrial robots, service robots, or another category?"
        ];
        
        return genericResponses[Math.floor(Math.random() * genericResponses.length)];
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
            showTypingIndicator();
            
            // Process the message and generate AI response
            const response = getAIResponse(message);
            
            // Simulate AI typing delay
            setTimeout(() => {
                // Remove typing indicator
                removeTypingIndicator();
                
                // Add AI response
                addMessage(response);
            }, Math.min(1000 + response.length * 10, 3000)); // Dynamic delay based on response length, but not more than 3 seconds
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