import React, { useRef } from 'react'

import './Input.css';

export default function Input({ message, setMessage, sendMessage }) {

    const inputRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage()
        inputRef.current.focus();
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                className="input"
                type="text"
                placeholder="Start typing..."
                value={message}
                onChange={({ target }) => setMessage(target.value)}
                onKeyPress={e => e.key === 'Enter' ? handleSubmit(e) : null}
            />
            <button className="sendButton" type="submit">
                <i className="fas fa-paper-plane"></i> Send
            </button>
        </form>

    )
}
