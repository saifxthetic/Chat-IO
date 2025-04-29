const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Set();

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socketsConnected.add(socket.id);
    console.log('Connected sockets:', Array.from(socketsConnected));

    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        socketsConnected.delete(socket.id);
        console.log('Connected sockets after disconnect:', Array.from(socketsConnected));
        io.emit('clients-total', socketsConnected.size);
    });

    socket.on('message', (data) => {
        if (data && data.name && data.message) {
            console.log(`📩 Message from ${data.name} (${socket.id}): ${data.message}`);
            socket.broadcast.emit('chat-message', data);
        } else {
            console.log('❌ Received invalid message data:', data);
        }
    });


    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });
});
