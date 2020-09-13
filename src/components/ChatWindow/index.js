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
  };
  return (
    <div className='message-container '>
      <div>
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
      <div>
        <input
          type='text'
          className='txt-clientId'
          placeholder='Type your Message'
          onChange={(event) => setMessage(event.target.value)}
        />
        <button
          type='button'
          className='btn-action fa fa-paper-plane'
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
}

ChatWindow.propTypes = {
  clientId: PropTypes.string.isRequired,
  startCall: PropTypes.func,
};

export default ChatWindow;
