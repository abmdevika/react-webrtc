import React, { useState, useEffect, useRef } from 'react';
import socket from '../../connectionHandler/socket';

import PropTypes from 'prop-types';

import './ChatWindow.scss';

function ChatWindow({ clientId, messageList, setMessageList }) {
  const [message, setMessage] = useState('');

  const msgRef = useRef();

  useEffect(() => {
    socket.on('updatechat', function (username, data) {
      new Audio('../hollow-582.mp3').play();
      setMessageList([
        ...messageList,
        { name: username, message: `${username}:- ${data}` },
      ]);
    });
    scrollToBottom();
  });

  const handleSendMessage = () => {
    setMessageList([
      ...messageList,
      { name: 'me', message: `me:- ${message}` },
    ]);
    socket.emit('sendchat', { clientId, message });
    setMessage('');
  };

  const scrollToBottom = () => {
    msgRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const handleKeyPress = (e) => {
    const x = e || window.event;
    const key = x.keyCode || x.which;
    if (key === 13 || key === 3) {
      //runs this function when enter is pressed
      message && handleSendMessage();
    }
  };

  return (
    <div className='message-container '>
      <div className='messageList'>
        <div>
          {messageList.map((msg, index) => (
            <p className={msg.name} key={index}>
              {msg.message}
            </p>
          ))}
          <span ref={msgRef} />
        </div>
      </div>

      <div className='input-group mb-3 send-button'>
        <input
          type='text'
          value={message}
          className='form-control'
          aria-label="Recipient's username"
          aria-describedby='button-addon2'
          placeholder='Type your Message...'
          onKeyPress={handleKeyPress}
          onChange={(event) => setMessage(event.target.value)}
        />
        <div className='input-group-append'>
          <button
            className='btn btn-primary'
            type='button'
            id='button-addon2'
            disabled={!message}
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

ChatWindow.propTypes = {
  clientId: PropTypes.string.isRequired,
  startCall: PropTypes.func,
};

export default ChatWindow;
