// TedouaR Robotics Hub - AI Assistant

document.addEventListener('DOMContentLoaded', function() {
    // Get AI assistant elements
    const aiButton = document.getElementById('ai-button');
    const aiChatContainer = document.getElementById('ai-chat-container');
    const aiChatClose = document.getElementById('ai-chat-close');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiMessages = document.getElementById('ai-chat-messages');
    
    // Check if AI assistant elements exist
    if (!aiButton || !aiChatContainer || !aiChatClose || !aiInput || !aiSend || !aiMessages) {
        return;
    }
    
    // Open chat when AI button is clicked
    aiButton.addEventListener('click', function() {
        aiChatContainer.classList.add('active');
        aiInput.focus();
    });
    
    // Close chat when close button is clicked
    aiChatClose.addEventListener('click', function() {
        aiChatContainer.classList.remove('active');
    });
    
    // Send message when send button is clicked or Enter key is pressed
    aiSend.addEventListener('click', sendMessage);
    aiInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Initial welcome messages with typing effect (shown one after another)
    const welcomeMessages = [
        "Hello! I'm your robotics guide. How can I help you explore the world of robots today?",
        "You can ask me about different robot categories, specific robots, or get recommendations based on your interests."
    ];
    
    let messageIndex = 0;
    let typingTimer;
    
    function showNextWelcomeMessage() {
        if (messageIndex < welcomeMessages.length) {
            addAIMessage(welcomeMessages[messageIndex], true);
            messageIndex++;
            
            if (messageIndex < welcomeMessages.length) {
                // Show next welcome message after a delay
                setTimeout(showNextWelcomeMessage, 1000);
            }
        }
    }
    
    // Start showing welcome messages
    // First message is already in the HTML, so we start from the second one
    if (welcomeMessages.length > 1) {
        messageIndex = 1;
        setTimeout(showNextWelcomeMessage, 1000);
    }
    
    // Function to send user message
    function sendMessage() {
        const userMessage = aiInput.value.trim();
        if (userMessage === '') return;
        
        // Add user message to chat
        addUserMessage(userMessage);
        
        // Clear input
        aiInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process user message and get AI response
        processUserMessage(userMessage);
    }
    
    // Function to add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'user-message';
        messageElement.innerHTML = `
            <div class="user-bubble">${message}</div>
            <div class="user-avatar">You</div>
        `;
        aiMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Function to add AI message to chat
    function addAIMessage(message, typing = false) {
        // Check if there's already a typing message
        const existingTypingIndicator = document.querySelector('.ai-message.typing');
        if (existingTypingIndicator && !typing) {
            existingTypingIndicator.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = typing ? 'ai-message typing' : 'ai-message';
        
        if (typing) {
            // For typing effect, start with empty text and type character by character
            messageElement.innerHTML = `
                <div class="ai-avatar"><i class="fas fa-robot"></i></div>
                <div class="ai-bubble"><span class="typing-text"></span><span class="typing-cursor">|</span></div>
            `;
            aiMessages.appendChild(messageElement);
            scrollToBottom();
            
            const typingText = messageElement.querySelector('.typing-text');
            const cursor = messageElement.querySelector('.typing-cursor');
            let charIndex = 0;
            
            // Clear any existing typing timer
            if (typingTimer) clearInterval(typingTimer);
            
            // Type each character with a delay
            typingTimer = setInterval(() => {
                if (charIndex < message.length) {
                    typingText.textContent += message[charIndex];
                    charIndex++;
                    scrollToBottom();
                } else {
                    // Done typing, remove cursor and typing class
                    clearInterval(typingTimer);
                    cursor.remove();
                    messageElement.classList.remove('typing');
                }
            }, 25); // Adjust typing speed here
        } else {
            // For instant messages, show the full text immediately
            messageElement.innerHTML = `
                <div class="ai-avatar"><i class="fas fa-robot"></i></div>
                <div class="ai-bubble">${message}</div>
            `;
            aiMessages.appendChild(messageElement);
            scrollToBottom();
        }
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const indicatorElement = document.createElement('div');
        indicatorElement.className = 'ai-message typing-indicator';
        indicatorElement.innerHTML = `
            <div class="ai-avatar"><i class="fas fa-robot"></i></div>
            <div class="ai-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        aiMessages.appendChild(indicatorElement);
        scrollToBottom();
        
        // Remove typing indicator after AI response is ready
        return indicatorElement;
    }
    
    // Function to scroll chat to bottom
    function scrollToBottom() {
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    
    // Function to process user message and generate AI response
    function processUserMessage(message) {
        // In a real implementation, this would be a call to an AI API
        // For this demo, we'll use predefined responses based on keywords
        
        // Remove any existing typing indicator
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        // Normalize message for keyword matching
        const normalizedMessage = message.toLowerCase();
        
        // Set response delay for a more natural conversation
        setTimeout(() => {
            let response;
            
            // Check for keywords to determine response
            if (normalizedMessage.includes('hello') || 
                normalizedMessage.includes('hi') || 
                normalizedMessage.includes('hey')) {
                
                response = "Hello there! How can I help you with robotics today?";
            } 
            else if (normalizedMessage.includes('what can you do') || 
                    normalizedMessage.includes('help me') || 
                    normalizedMessage.includes('capabilities')) {
                
                response = "I can help you explore different robot types, explain robot specifications, suggest robots for specific tasks, or answer general robotics questions. What would you like to know about?";
            }
            else if (normalizedMessage.includes('industrial robot') || 
                    normalizedMessage.includes('factory robot')) {
                
                response = "Industrial robots are automated, programmable machines designed for manufacturing tasks. They're commonly used for assembly, welding, painting, and material handling. The most well-known examples include ABB's IRB series, FANUC's R-2000 series, and KUKA's industrial robots. Would you like to see specific industrial robots in our database?";
            }
            else if (normalizedMessage.includes('humanoid')) {
                
                response = "Humanoid robots are designed to resemble human body structure and behavior. Notable examples include Boston Dynamics' Atlas, SoftBank's Pepper, Honda's ASIMO, and NASA's Valkyrie. These robots are used for research, customer service, entertainment, and potential future space exploration. Would you like more information about a specific humanoid robot?";
            }
            else if (normalizedMessage.includes('quadruped') || 
                    normalizedMessage.includes('four legged') || 
                    normalizedMessage.includes('four-legged')) {
                
                response = "Quadruped robots are four-legged machines inspired by animal locomotion. They excel at navigating difficult terrain where wheeled robots struggle. Popular examples include Boston Dynamics' Spot, ANYbotics' ANYmal, Unitree's A1, and Ghost Robotics' Vision. Would you like to learn more about any specific quadruped robot?";
            }
            else if (normalizedMessage.includes('spot') || 
                    normalizedMessage.includes('boston dynamics')) {
                
                response = "Spot is Boston Dynamics' agile quadruped robot designed for industrial inspection, construction monitoring, and public safety applications. It can navigate difficult terrain, climb stairs, and carry payloads up to 14kg. Spot features 360° perception, can be operated remotely or autonomously, and has a runtime of about 90 minutes. Would you like to see more details about Spot in our encyclopedia?";
            }
            else if (normalizedMessage.includes('atlas')) {
                
                response = "Atlas is Boston Dynamics' advanced humanoid robot. Standing at 1.5m tall, it demonstrates incredible mobility and dexterity, including the ability to run, jump, backflip, and manipulate objects with its hands. Atlas uses a combination of hydraulic and electric actuation with sophisticated control systems. It's primarily a research platform pushing the boundaries of robotics technology. Would you like to see Atlas in our encyclopedia?";
            }
            else if (normalizedMessage.includes('drone') || 
                    normalizedMessage.includes('uav') || 
                    normalizedMessage.includes('aerial')) {
                
                response = "Drones or UAVs (Unmanned Aerial Vehicles) are aircraft without human pilots onboard. They range from small consumer quadcopters to large military surveillance platforms. Popular manufacturers include DJI, Skydio, and Parrot. Applications include photography, surveying, delivery, search and rescue, and agricultural monitoring. Are you interested in a particular type of drone?";
            }
            else if (normalizedMessage.includes('medical') || 
                    normalizedMessage.includes('healthcare') || 
                    normalizedMessage.includes('surgical')) {
                
                response = "Medical robots assist healthcare professionals in various ways. Surgical robots like Intuitive Surgical's da Vinci System enhance precision during operations. Rehabilitation robots help patients recover motor function. Disinfection robots use UV light to sanitize hospital rooms. Would you like information about a specific medical robot application?";
            }
            else if (normalizedMessage.includes('military') || 
                    normalizedMessage.includes('defense')) {
                
                response = "Military robots serve various defense purposes including reconnaissance, bomb disposal, logistics support, and combat operations. Examples include Boston Dynamics' Spot robots modified for reconnaissance, iRobot's PackBot for explosive ordnance disposal, and various unmanned ground and aerial vehicles. Is there a specific military robot application you'd like to explore?";
            }
            else if (normalizedMessage.includes('space') || 
                    normalizedMessage.includes('mars') || 
                    normalizedMessage.includes('nasa')) {
                
                response = "Space robots are essential for exploration beyond Earth. Mars rovers like NASA's Perseverance and Curiosity collect data and samples from the Martian surface. The International Space Station uses Canadarm2 and Dextre for maintenance. Future missions may rely even more on autonomous robots. Would you like to learn about a specific space robot?";
            }
            else if (normalizedMessage.includes('underwater') || 
                    normalizedMessage.includes('marine') || 
                    normalizedMessage.includes('ocean')) {
                
                response = "Underwater robots or ROVs (Remotely Operated Vehicles) explore ocean depths inaccessible to humans. They're used for scientific research, pipeline inspection, shipwreck exploration, and environmental monitoring. Woods Hole Oceanographic Institution's Jason and Alvin are famous examples. Would you like to know more about underwater robotics?";
            }
            else if (normalizedMessage.includes('consumer') || 
                    normalizedMessage.includes('home') || 
                    normalizedMessage.includes('personal')) {
                
                response = "Consumer robots are designed for personal and household use. They include robot vacuums (iRobot Roomba, Roborock), lawn mowers (Husqvarna Automower), pool cleaners (Dolphin), personal assistants (Amazon Astro), and entertainment robots (Sony Aibo). Is there a specific type of consumer robot you're interested in?";
            }
            else if (normalizedMessage.includes('agriculture') || 
                    normalizedMessage.includes('farming')) {
                
                response = "Agricultural robots automate farming tasks to increase efficiency and reduce labor costs. They include autonomous tractors, harvesting robots, weeding robots, and crop monitoring drones. Companies like John Deere, Naio Technologies, and Abundant Robotics are developing innovative solutions for modern farming. Would you like to know more about a specific agricultural robot application?";
            }
            else if (normalizedMessage.includes('history') || 
                    normalizedMessage.includes('first robot')) {
                
                response = "The history of robotics spans centuries, from ancient mechanical automata to modern AI-powered machines. The word 'robot' was first introduced in 1920 by Karel Čapek in his play R.U.R. The first industrial robot, Unimate, was installed at a General Motors plant in 1961. Would you like to know more about a specific era in robotics history?";
            }
            else if (normalizedMessage.includes('future') || 
                    normalizedMessage.includes('advancement') || 
                    normalizedMessage.includes('upcoming')) {
                
                response = "The future of robotics is likely to include more advanced AI integration, improved human-robot collaboration, soft and bioinspired robotics, swarm robotics, and increased autonomy. We may see robots becoming more common in healthcare, autonomous transportation, and everyday home environments. Is there a specific area of future robotics you're curious about?";
            }
            else if (normalizedMessage.includes('ai') || 
                    normalizedMessage.includes('artificial intelligence') || 
                    normalizedMessage.includes('machine learning')) {
                
                response = "AI and robotics are increasingly intertwined. Modern robots use AI for perception (computer vision), navigation, manipulation, and decision-making. Machine learning allows robots to improve their performance through experience. Deep reinforcement learning has enabled robots to master complex tasks like game playing and dexterous manipulation. Would you like to know how AI is used in a specific robotic application?";
            }
            else if (normalizedMessage.includes('anymal') || 
                    normalizedMessage.includes('anybotics')) {
                
                response = "ANYmal is a quadruped robot developed by ANYbotics, a Swiss robotics company. It's designed for autonomous operation in challenging environments, particularly for industrial inspection tasks. ANYmal can walk, run, climb stairs, and carry payloads. It features 360° perception using LiDAR and cameras, and has about 2-4 hours of operation time. Would you like to see ANYmal in our encyclopedia?";
            }
            else if (normalizedMessage.includes('pepper') || 
                    normalizedMessage.includes('softbank')) {
                
                response = "Pepper is a semi-humanoid robot developed by SoftBank Robotics. Standing 1.2m tall, it's designed to recognize faces and basic human emotions. Pepper is primarily used for customer service, retail assistance, and as a companion robot. It features a touchscreen display on its chest and can communicate through speech, body movements, and the screen interface. Would you like to learn more about Pepper?";
            }
            else if (normalizedMessage.includes('perseverance') || 
                    normalizedMessage.includes('curiosity') || 
                    normalizedMessage.includes('mars rover')) {
                
                response = "NASA's Mars rovers like Perseverance and Curiosity are autonomous vehicles designed to explore the Martian surface. Perseverance, which landed in February 2021, carries advanced scientific instruments to search for signs of ancient microbial life, collect rock and soil samples, and test oxygen production from the Martian atmosphere. It also deployed Ingenuity, the first helicopter to fly on another planet. Would you like more details about Mars rovers?";
            }
            else if (normalizedMessage.includes('asimo') || 
                    normalizedMessage.includes('honda')) {
                
                response = "ASIMO (Advanced Step in Innovative Mobility) was a humanoid robot developed by Honda. Standing at 130cm tall, ASIMO could walk, run, climb stairs, and interact with humans. It featured advanced mobility and dexterity, allowing it to perform tasks like carrying objects and recognizing faces. While Honda discontinued ASIMO in 2018, it remains an important milestone in humanoid robotics development. Would you like to know more about ASIMO's capabilities?";
            }
            else if (normalizedMessage.includes('roomba') || 
                    normalizedMessage.includes('vacuum') || 
                    normalizedMessage.includes('irobot')) {
                
                response = "The Roomba, developed by iRobot, is one of the most successful consumer robots in history. This autonomous vacuum cleaner uses sensors to navigate homes, detect dirt, and avoid obstacles. Modern Roombas feature mapping technology, smartphone control, and can empty themselves into a base station. Since its introduction in 2002, millions of Roombas have been sold worldwide. Would you like more information about robot vacuums?";
            }
            else if (normalizedMessage.includes('da vinci') || 
                    normalizedMessage.includes('surgical')) {
                
                response = "The da Vinci Surgical System is a robotic surgery platform developed by Intuitive Surgical. It allows surgeons to perform minimally invasive procedures with enhanced precision and control. The surgeon operates from a console, controlling robotic arms equipped with surgical instruments and a high-definition 3D camera. Since its FDA approval in 2000, millions of procedures have been performed using da Vinci systems worldwide. Would you like more information about surgical robots?";
            }
            else if (normalizedMessage.includes('sophia') ||
                    normalizedMessage.includes('hanson robotics')) {
                
                response = "Sophia is a humanoid robot developed by Hanson Robotics. Known for her human-like appearance and behavior, Sophia can display more than 50 facial expressions and engage in conversations. She uses AI, visual data processing, and facial recognition, and has appeared in numerous media interviews and conferences. While Sophia has limitations, she represents advances in social robotics and human-robot interaction. Would you like to know more about social humanoid robots?";
            }
            else if (normalizedMessage.includes('thank')) {
                
                response = "You're welcome! I'm happy to help with any other robotics questions you might have. Feel free to ask about specific robots, applications, or technologies anytime.";
            }
            else if (normalizedMessage.includes('bye') || 
                    normalizedMessage.includes('goodbye')) {
                
                response = "Goodbye! Feel free to return anytime you have questions about robotics. I'll be here to help!";
            }
            else {
                // Default response for unrecognized queries
                response = "That's an interesting question about robotics. While I don't have specific information on that particular topic, I'd be happy to help you explore our robot encyclopedia or discuss different categories of robots like industrial, humanoid, quadruped, or service robots. What area of robotics interests you most?";
            }
            
            // Add AI response with typing effect
            addAIMessage(response, true);
            
        }, 1000); // Simulated processing delay
    }
    
    // Add CSS for the AI assistant
    const style = document.createElement('style');
    style.textContent = `
        .ai-assistant {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 999;
        }
        
        .ai-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(to right, #0cebeb, #20e3b2);
            box-shadow: 0 5px 20px rgba(32, 227, 178, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .ai-button:hover {
            transform: scale(1.1);
        }
        
        .ai-icon {
            color: white;
            font-size: 24px;
        }
        
        .ai-chat-container {
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 350px;
            height: 500px;
            background-color: #1e1e1e;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
            transition: all 0.3s ease;
        }
        
        .ai-chat-container.active {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }
        
        .ai-chat-header {
            padding: 15px 20px;
            background: linear-gradient(to right, #0cebeb, #20e3b2);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .ai-chat-title {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .ai-chat-close {
            cursor: pointer;
            font-size: 1.2rem;
        }
        
        .ai-chat-messages {
            flex-grow: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .ai-message, .user-message {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            max-width: 80%;
        }
        
        .ai-message {
            align-self: flex-start;
        }
        
        .user-message {
            align-self: flex-end;
            flex-direction: row-reverse;
        }
        
        .ai-avatar, .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.8rem;
        }
        
        .ai-avatar {
            background: linear-gradient(to right, #0cebeb, #20e3b2);
            color: white;
        }
        
        .user-avatar {
            background-color: #444;
            color: white;
        }
        
        .ai-bubble, .user-bubble {
            padding: 12px 15px;
            border-radius: 18px;
            font-size: 0.95rem;
            line-height: 1.4;
        }
        
        .ai-bubble {
            background-color: #2a2a2a;
            color: white;
            border-top-left-radius: 4px;
        }
        
        .user-bubble {
            background-color: #20e3b2;
            color: #1e1e1e;
            border-top-right-radius: 4px;
        }
        
        .ai-chat-input {
            padding: 15px;
            display: flex;
            gap: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        #ai-input {
            flex-grow: 1;
            padding: 10px 15px;
            border-radius: 30px;
            border: none;
            background-color: #2a2a2a;
            color: white;
            font-size: 0.95rem;
        }
        
        #ai-input:focus {
            outline: none;
        }
        
        #ai-send {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(to right, #0cebeb, #20e3b2);
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        #ai-send:hover {
            transform: scale(1.1);
        }
        
        /* Typing indicator */
        .typing-indicator .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.5);
            display: inline-block;
            animation: bounce 1.5s infinite ease-in-out;
        }
        
        .typing-dots span:nth-child(1) {
            animation-delay: 0s;
        }
        
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes bounce {
            0%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-8px);
            }
        }
        
        .typing-cursor {
            display: inline-block;
            width: 2px;
            height: 18px;
            background-color: var(--primary);
            animation: blink 1s infinite;
            vertical-align: middle;
            margin-left: 2px;
        }
        
        @keyframes blink {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0;
            }
        }
        
        /* Scrollbar styles */
        .ai-chat-messages::-webkit-scrollbar {
            width: 6px;
        }
        
        .ai-chat-messages::-webkit-scrollbar-track {
            background: #1e1e1e;
        }
        
        .ai-chat-messages::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 3px;
        }
        
        .ai-chat-messages::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
            .ai-chat-container {
                width: calc(100% - 40px);
                height: 60vh;
                bottom: 80px;
            }
        }
    `;
    document.head.appendChild(style);
});
