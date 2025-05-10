// TedouaR Robotics Hub - AI Assistant
document.addEventListener('DOMContentLoaded', function() {
    // Get the AI assistant elements
    const aiButton = document.getElementById('ai-button');
    const aiChatContainer = document.getElementById('ai-chat-container');
    const aiChatClose = document.getElementById('ai-chat-close');
    const aiChatMessages = document.getElementById('ai-chat-messages');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    
    // Sample knowledgebase for the AI assistant
    const knowledgeBase = {
        greetings: [
            "Hello! How can I help you explore the world of robotics today?",
            "Hi there! I'm your robotics guide. What would you like to know?",
            "Welcome to TedouaR Robotics Hub! What robotics topic are you interested in?"
        ],
        farewell: [
            "Goodbye! Feel free to return if you have more robotics questions.",
            "Have a great day! Come back anytime for more robotics information.",
            "Thanks for chatting! I'm here whenever you want to learn more about robots."
        ],
        robotTypes: {
            industrial: "Industrial robots are automatically controlled, reprogrammable, multipurpose manipulators programmable in three or more axes. They're designed for a wide variety of applications in manufacturing and production settings.",
            service: "Service robots assist humans by performing useful tasks (excluding industrial automation). They can be categorized as professional service robots or personal/domestic service robots.",
            humanoid: "Humanoid robots are designed to resemble the human body in shape. They typically have a torso, head, two arms, and two legs, though some forms may model only part of the body.",
            quadruped: "Quadruped robots are four-legged robots inspired by animals like dogs or cats. They excel at navigating rough terrain due to their stable platform and adaptable gait.",
            agv: "Automated Guided Vehicles (AGVs) are mobile robots that follow markers or wires in the floor, or use vision, magnets, or lasers for navigation. They're often used in industrial settings for material transport."
        },
        famousRobots: {
            spot: "Spot is a quadruped robot developed by Boston Dynamics. It can navigate terrain, climb stairs, and perform automated inspection tasks in industrial environments.",
            atlas: "Atlas is a humanoid robot by Boston Dynamics designed to navigate rough terrain and perform complex physical tasks like running, jumping, and even backflips.",
            pepper: "Pepper is a semi-humanoid robot by SoftBank Robotics designed to recognize faces and basic human emotions. It's often used in customer service settings.",
            roomba: "Roomba is an autonomous robotic vacuum cleaner by iRobot that navigates and cleans homes with minimal human intervention.",
            asimo: "ASIMO (Advanced Step in Innovative Mobility) was a humanoid robot created by Honda. It could walk, run, climb stairs, and interact with people."
        },
        companies: {
            "boston dynamics": "Boston Dynamics is an American engineering and robotics company known for developing highly mobile robots like Spot (quadruped) and Atlas (humanoid).",
            "abb": "ABB is a Swiss-Swedish multinational corporation specializing in robotics, power, and automation technology. They're one of the world's largest industrial robot manufacturers.",
            "kuka": "KUKA is a German manufacturer of industrial robots and solutions for factory automation. Their robots are widely used in the automotive industry.",
            "fanuc": "FANUC is a Japanese manufacturer of robots and factory automation systems. They're one of the largest makers of industrial robots in the world.",
            "softbank robotics": "SoftBank Robotics (formerly Aldebaran Robotics) is known for creating robots like Pepper and NAO, focused on service and educational applications."
        },
        applications: {
            manufacturing: "Robots in manufacturing handle tasks like assembly, welding, painting, packaging, and quality control, increasing efficiency and precision while reducing costs.",
            healthcare: "In healthcare, robots assist with surgery, rehabilitation, diagnostics, medication delivery, and patient care, enhancing precision and reducing invasiveness.",
            agriculture: "Agricultural robots help with planting, harvesting, weeding, sorting, and environmental monitoring, addressing labor shortages and increasing efficiency.",
            exploration: "Exploration robots venture into environments too dangerous or inaccessible for humans, like deep oceans, space, disaster zones, and hazardous industrial areas.",
            education: "Educational robots serve as teaching tools to introduce students to programming, engineering, and robotics concepts in an engaging, hands-on way."
        }
    };
    
    // If AI assistant elements exist on the page
    if (aiButton && aiChatContainer && aiChatClose && aiChatMessages && aiInput && aiSend) {
        // Open AI chat container when button is clicked
        aiButton.addEventListener('click', function() {
            aiChatContainer.style.display = 'flex';
            aiInput.focus();
        });
        
        // Close AI chat container when close button is clicked
        aiChatClose.addEventListener('click', function() {
            aiChatContainer.style.display = 'none';
        });
        
        // Send message when send button is clicked or Enter key is pressed
        aiSend.addEventListener('click', sendMessage);
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Function to handle sending user messages
        function sendMessage() {
            const messageText = aiInput.value.trim();
            if (messageText) {
                // Add user message to chat
                addMessage('user', messageText);
                
                // Clear input field
                aiInput.value = '';
                
                // Get AI response after a short delay
                setTimeout(() => {
                    const response = generateResponse(messageText);
                    addMessage('assistant', response);
                }, 600);
            }
        }
        
        // Function to add a message to the chat
        function addMessage(role, content) {
            const messageDiv = document.createElement('div');
            messageDiv.className = role === 'user' ? 'user-message' : 'ai-message';
            
            const avatar = document.createElement('div');
            avatar.className = role === 'user' ? 'user-avatar' : 'ai-avatar';
            
            const icon = document.createElement('i');
            icon.className = role === 'user' ? 'fas fa-user' : 'fas fa-robot';
            avatar.appendChild(icon);
            
            const bubble = document.createElement('div');
            bubble.className = role === 'user' ? 'user-bubble' : 'ai-bubble';
            bubble.textContent = content;
            
            if (role === 'user') {
                messageDiv.appendChild(bubble);
                messageDiv.appendChild(avatar);
            } else {
                messageDiv.appendChild(avatar);
                messageDiv.appendChild(bubble);
            }
            
            aiChatMessages.appendChild(messageDiv);
            
            // Scroll to the bottom of the chat container
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        }
        
        // Function to generate a response based on the user message
        function generateResponse(message) {
            const lowercaseMessage = message.toLowerCase();
            
            // Check for greetings
            if (lowercaseMessage.match(/^(hi|hello|hey|greetings)/)) {
                return randomResponse(knowledgeBase.greetings);
            }
            
            // Check for farewell
            if (lowercaseMessage.match(/^(bye|goodbye|farewell|see you)/)) {
                return randomResponse(knowledgeBase.farewell);
            }
            
            // Check for question about robot types
            if (lowercaseMessage.includes('industrial robot')) {
                return knowledgeBase.robotTypes.industrial;
            } else if (lowercaseMessage.includes('service robot')) {
                return knowledgeBase.robotTypes.service;
            } else if (lowercaseMessage.includes('humanoid')) {
                return knowledgeBase.robotTypes.humanoid;
            } else if (lowercaseMessage.includes('quadruped')) {
                return knowledgeBase.robotTypes.quadruped;
            } else if (lowercaseMessage.includes('agv') || lowercaseMessage.includes('automated guided vehicle')) {
                return knowledgeBase.robotTypes.agv;
            }
            
            // Check for questions about specific robots
            for (const robot in knowledgeBase.famousRobots) {
                if (lowercaseMessage.includes(robot)) {
                    return knowledgeBase.famousRobots[robot];
                }
            }
            
            // Check for questions about robotics companies
            for (const company in knowledgeBase.companies) {
                if (lowercaseMessage.includes(company)) {
                    return knowledgeBase.companies[company];
                }
            }
            
            // Check for questions about applications
            for (const application in knowledgeBase.applications) {
                if (lowercaseMessage.includes(application)) {
                    return knowledgeBase.applications[application];
                }
            }
            
            // Check for general questions about robots
            if (lowercaseMessage.includes('what is a robot')) {
                return "A robot is a machine—especially one programmable by a computer—capable of carrying out a complex series of actions automatically. Robots can be guided by an external control device or the control may be embedded within.";
            } else if (lowercaseMessage.includes('who invented')) {
                return "The word 'robot' was first used in 1920 by Czech writer Karel Čapek in his play 'R.U.R'. However, the concept of mechanical servants dates back to ancient civilizations. The first digital and programmable robot was invented by George Devol in 1954 and was named Unimate.";
            } else if (lowercaseMessage.includes('how many types')) {
                return "There are several ways to categorize robots, but common types include industrial robots, service robots, humanoid robots, mobile robots, autonomous robots, remote-controlled robots, and collaborative robots (cobots). Each serves different purposes and has unique capabilities.";
            }
            
            // If no specific match is found, provide a general response
            const generalResponses = [
                "I'm sorry, I don't have specific information about that yet. Would you like to know about industrial robots, humanoid robots, or famous robot examples?",
                "That's an interesting question! While I'm continuing to learn, I can help with information about robot types, applications, or specific robots like Spot or Atlas.",
                "I don't have that specific information in my knowledge base yet. You might find an answer in our encyclopedia section. Is there something else I can help with?"
            ];
            
            return randomResponse(generalResponses);
        }
        
        // Function to pick a random response from an array
        function randomResponse(responses) {
            const randomIndex = Math.floor(Math.random() * responses.length);
            return responses[randomIndex];
        }
    }
});
