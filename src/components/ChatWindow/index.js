import React, { useState, useEffect } from 'react';
import socket from '../../connectionHandler/socket';

import PropTypes from 'prop-types';
import './ChatWindow.scss';

function ChatWindow({ clientId }) {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on('updatechat', function (username, data) {
      console.log('connected', username, data);
      setMessageList([...messageList, `${username}:- ${data}`]);
    });
  });

  const handleSendMessage = () => {
    setMessageList([...messageList, `${clientId}:- ${message}`]);
    socket.emit('sendchat', { clientId, message });
    setMessage('');
  };
  return (
    <div className='message-container '>
      <div class='messageList'>
        <div>
          {messageList.map((msg) => (
            <p>{msg}</p>
          ))}
        </div>
        <h3>
          User Name
          {` ${clientId}`}
        </h3>
      </div>

      <div className='input-group mb-3 send-button'>
        <input
          type='text'
          value={message}
          className='form-control'
          aria-label="Recipient's username"
          aria-describedby='button-addon2'
          placeholder='Type your Message...'
          onChange={(event) => setMessage(event.target.value)}
        />
        <div className='input-group-append'>
          <button
            className='btn btn-outline-secondary'
            type='button'
            id='button-addon2'
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
