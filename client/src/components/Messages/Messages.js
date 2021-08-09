import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message/Message';

import './Messages.css';

const MAX_NAMES = 3;

// You
// You and Helen
// You, Helen and John
// You, Helen, John and 1 other
// You, Helen, John and 2 others
const formatNames = (names, maxNames = MAX_NAMES) => {
    if (names.length < MAX_NAMES) {
        return names.join(' and ');
    } else if (names.length === MAX_NAMES) {
        return `${names.slice(0, MAX_NAMES - 1).join(', ')} and ${names[names.length - 1]}`;
    } else {
        let nOtherNames = names.length - MAX_NAMES;
        return `${names.slice(0, MAX_NAMES).join(', ')} and ${nOtherNames} other${nOtherNames > 1 ? 's' : ''}`
    }
}

export default function Messages({ messages, name, users, typers }) {

    // Format users including current client
    users = users.filter(user => user.name !== name);
    let names = users.map(user => user.name);
    names.unshift('You');
    let inlineUsers = formatNames(names);

    // Format typers excluding current client
    let typersJoin = '';
    if(typers.length > 1) {
        typersJoin = ' are ';
    } else {
        typersJoin = ' is '
    }
    let inlineTypers = `${formatNames(typers)}${typersJoin}typing...`;

    return (
        <React.Fragment>
            <div className="users">
                <i className="fas fa-users"></i>
                <span className="inlineNames">
                    {inlineUsers}
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
                    typers.length > 0 && (
                        <React.Fragment>
                            <span className="tiblock">
                                <i className="tidot"></i>
                                <i className="tidot"></i>
                                <i className="tidot"></i>
                                <span className="typers">
                                    {inlineTypers}
                                </span>
                            </span>
                        </React.Fragment>
                    )
                }
            </div>
        </React.Fragment>

    )
}
