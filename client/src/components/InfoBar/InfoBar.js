import React from 'react'

import './InfoBar.css';

export default function InfoBar({ room }) {
    return (
        <div className="infoBar">
            <div className="leftInnerContainer">
                <i className="fas fa-circle"></i>
                <h3>{room}</h3>
            </div>
            <div className="rightInnerContainer">
                <a href="/"><i className="fas fa-times"></i></a>
            </div>
        </div>
    )
}
