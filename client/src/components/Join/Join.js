import React, { useState } from 'react'
import { Link } from 'react-router-dom';

import './Join.css';

export default function Join() {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join A Room</h1>
                <div>
                    <input
                        placeholder="Name"
                        className="joinInput"
                        type="text"
                        onChange={({ target }) => setName(target.value)}
                        value={name}
                    />
                </div>
                <div>
                    <select
                        value={room}
                        onChange={({ target }) => setRoom(target.value)} defaultValue="default"
                        className="joinInput mt-20"
                    >
                        <option value="default">Select A Room</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="PHP">PHP</option>
                        <option value=".NET">.NET</option>
                        <option value="Ruby">Ruby</option>
                    </select>
                </div>
                <Link
                    onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}
                >
                    <button className="button mt-20" type="submit">Sign In</button>
                </Link>
            </div>
        </div>
    )
}
