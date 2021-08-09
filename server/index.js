const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;
const BOT_NAME = 'Chat Bot';

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log('New connection');

    socket.on('join', ({ name, room }, callback = null) => {
        const { error, user } = addUser({
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
            users: getUsersInRoom(user.room)
        });

        callback && callback();
    });

    socket.on('sendMessage', (message, callback = null) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback && callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: BOT_NAME, text: `${user.name} has left...` });

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
})

app.use(router);

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
