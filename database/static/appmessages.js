const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const chatTitle = document.getElementById('chatTitle');
const chatSubtitle = document.getElementById('chatSubtitle');
const conversationsList = document.getElementById('conversationsList');

function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        area: urlParams.get('area'),
        type: urlParams.get('type'),
        credits: urlParams.get('credits')
    };
}

function formatTime() {
    return new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function createMessageElement(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message__content';
    
    const textP = document.createElement('p');
    textP.textContent = text;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message__time';
    timeSpan.textContent = formatTime();
    
    contentDiv.appendChild(textP);
    contentDiv.appendChild(timeSpan);
    
    if (type === 'sent') {
        const checkmark = document.createElement('i');
        checkmark.className = 'fas fa-check-double';
        contentDiv.appendChild(checkmark);
    }
    
    messageDiv.appendChild(contentDiv);
    return messageDiv;
}

function setupChat() {
    const params = getUrlParams();
    if (params.area) {
        chatTitle.textContent = 'User';
        chatSubtitle.textContent = `${params.credits} credits/hour`;
        
        const conversation = document.createElement('div');
        conversation.className = 'conversation active';
        conversation.innerHTML = `
            <div class="conversation__avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="conversation__info">
                <h3>User</h3>
                <p>${params.credits} credits/hour</p>
            </div>
            <div class="conversation__meta">
                <span class="time">${formatTime()}</span>
            </div>
        `;
        conversationsList.appendChild(conversation);
        
        const welcomeMessage = createMessageElement(
            `Hello! I'm interested in discussing this opportunity.`,
            'received'
        );
        chatMessages.appendChild(welcomeMessage);
    }
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (text) {
        const messageElement = createMessageElement(text, 'sent');
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        messageInput.value = '';
        
        setTimeout(() => {
            const responses = [
                "Thanks for your message. When would you like to schedule this?",
                "I'll check my availability and get back to you soon.",
                "Could you provide more details about what you need?",
                "What time works best for you?",
                "I'm available to discuss further details."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const responseElement = createMessageElement(randomResponse, 'received');
            chatMessages.appendChild(responseElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

menu.addEventListener('click', () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

window.addEventListener('DOMContentLoaded', setupChat);