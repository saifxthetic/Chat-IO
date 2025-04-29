const socket = io();


const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const typingDiv = document.getElementById('typing'); 


messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Clients total: ${data}`;
});


function sendMessage() {
    if (messageInput.value === '') return;

    const data = {
        name: nameInput.value || 'Anonymous',
        message: messageInput.value,
    };

    socket.emit('message', data);

    addMessageToUI(true, data);

    messageInput.value = '';
    scrollToBottom(); 
}


socket.on('chat-message', (data) => {
    addMessageToUI(false, data);
    scrollToBottom(); 
});


messageInput.addEventListener('input', () => {
    socket.emit('typing', { name: nameInput.value });
});


socket.on('typing', (data) => {
    typingDiv.innerText = `${data.name} is typing...`;

    clearTimeout(typingDiv.timer);
    typingDiv.timer = setTimeout(() => {
        typingDiv.innerText = '';
    }, 2000);
});

function addMessageToUI(isOwnMessage, data) {
    const element = `
        <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
            <p class="message">
                ${data.message}
                <span>${data.name} • ${new Date().toLocaleTimeString()}</span>
            </p>
        </li>
    `;
    messageContainer.innerHTML += element;
}


function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
