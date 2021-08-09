import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message/Message';

import './Messages.css';

const MAX_NAMES = 3;

export default function Messages({ messages, name, users, typers }) {

    users = users.filter(user => user.name !== name);
    let names = users.map(user => user.name);
    names.unshift('You');
    let inlineNames;

    // You
    // You and Helen
    // You, Helen and John
    // You, Helen, John and 1 other
    // You, Helen, John and 2 others
    if (names.length < MAX_NAMES) {
        inlineNames = names.join(' and ');
    } else if (names.length === MAX_NAMES) {
        inlineNames = `${names.slice(0, MAX_NAMES - 1).join(', ')} and ${names[names.length - 1]}`;
    } else {
        let nOtherNames = names.length - MAX_NAMES;
        inlineNames = `${names.slice(0, MAX_NAMES).join(', ')} and ${nOtherNames} other${nOtherNames > 1 ? 's' : ''}`
    }

    return (
        <React.Fragment>
            <div className="users">
                <i className="fas fa-users"></i>
                <span className="inlineNames">
                    {inlineNames}
                </span>
            </div>
            <ScrollToBottom className="scroll">
                <div className="messages">
                    {messages.map((message, ind) => (
                        <div key={ind}>
                            <Message message={message} name={name} />
                        </div>
                    ))}
                </div>
            </ScrollToBottom>
            <div className="ticontainer">
                {
                    typers.length > 0 &&
                    <div className="tiblock">
                        <div className="tidot"></div>
                        <div className="tidot"></div>
                        <div className="tidot"></div>
                    </div>
                }
            </div>
        </React.Fragment>

    )
}
