const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const UserService = require('./services/UserService');
const router = require('./router');
const cors = require('cors');

const userService = new UserService();
const PORT = process.env.PORT || 5000;
const BOT_NAME = 'Chat Bot';

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors());

io.on('connection', (socket) => {

    // Join room response
    socket.on('join', ({ name, room }, callback = null) => {
        const { error, user } = userService.addUser({
            id: socket.id,
            name,
            room
        });

        if (error && callback) return callback(error);

        socket.emit('message', { user: BOT_NAME, text: `Welcome to ${user.room}!` });

        io.sockets.to(user.room).emit('message', { user: BOT_NAME, text: `${user.name} has joined the room` });

        socket.join(user.room);

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: userService.getUsersInRoom(user.room)
        });

        callback && callback();
    });

    // Typing response
    socket.on('typing', (callback = null) => {
        const user = userService.getUser(socket.id);

        io.sockets.to(user.room).emit('isTyping', { name: user.name });

        callback && callback();
    });

    // Stop typing response
    socket.on('notTyping', (callback = null) => {
        const user = userService.getUser(socket.id);

        io.sockets.to(user.room).emit('isntTyping', { name: user.name });

        callback && callback();
    });

    // Message response
    socket.on('sendMessage', (message, callback = null) => {
        const user = userService.getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: userService.getUsersInRoom(user.room)
        });

        callback && callback();
    });

    // Leave room response
    socket.on('disconnect', () => {
        const user = userService.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: BOT_NAME, text: `${user.name} has left...` });

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: userService.getUsersInRoom(user.room)
            });

            io.sockets.to(user.room).emit('isntTyping', { name: user.name });
        }
    });
})

app.use(router);

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
