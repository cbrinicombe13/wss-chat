import React, { useState, useEffect, useRef } from 'react'
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
    const [users, setUsers] = useState([]);
    const [typers, setTypers] = useState([]);
    const prevMessageRef = useRef('');

    // Join room
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
        // Messaging listener
        socket.on('message', (message) => {
            setMessages(msgs => [...msgs, message]);
        });

        // Room users listener
        socket.on('roomData', (data) => {
            setUsers(data.users);
        });

        // Typing on listener
        socket.on('isTyping', (typer) => {
            setTypers(tprs => [...tprs, typer.name]);
        })

        // Typing off listener
        socket.on('isntTyping', (typer) => {
            typer.name !== name && setTypers(tprs => tprs.filter(tprName => tprName !== typer.name));
        })

        return () => {
            socket.disconnect();
            socket.off();
        }
    }, []);

    // Typing emitters
    useEffect(() => {
        const startedTyping = prevMessageRef.current === "" && message !== "";
        const stoppedTyping = prevMessageRef.current !== "" && message === "";

        if (startedTyping) {
            socket.emit('typing');
        }

        if (stoppedTyping) {
            socket.emit('notTyping');
        }

        prevMessageRef.current = message;
    }, [prevMessageRef, message]);

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
                <Messages
                    messages={messages}
                    name={name}
                    users={users}
                    typers={typers}
                />
                <Input
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
        </div>
    )
}
