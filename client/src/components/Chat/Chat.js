import React, { useState, useEffect } from 'react'
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

let socket;
const ENDPOINT = 'localhost:5000';

export default function Chat({ location }) {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setusers] = useState([]);

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        setName(name);
        setRoom(room);

        socket = io(ENDPOINT);

        socket.emit('join', { name, room });

        return () => {
            socket.disconnect();
            socket.off();
        }
    }, [location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(msgs => [...msgs, message]);
        });

        socket.on('roomData', (data) => {
            setusers(data.users);
        });

        return () => {
            socket.disconnect();
            socket.off();
        }
    }, []);

    const sendMessage = () => {
        if (message) {
            socket.emit('sendMessage', message);
            setMessage("");
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} users={users} />
                <Input
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
        </div>
    )
}
