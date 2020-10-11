import React, { useState, useEffect } from 'react';
import ChatWindow from '../ChatWindow';
import UserList from '../UserList/index.tsx';
import socket from '../../connectionHandler/socket';
import './ControlWindow.scss';

function ControlWindow({ clientId, handleSnackMessage }) {
  const [selectedTab, setSelectedTab] = useState('chat');
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket
      .on('newUser', function (data) {
        new Audio('../gesture-192.mp3').play();
        handleSnackMessage(`${data.name} joined the call`);
        setJoinedUsers([...joinedUsers, { name: data.name }]);
      })
      .on('userLeft', function (data) {
        new Audio('../done-for-you-612.mp3').play();
        handleSnackMessage(`${data.name} left the call`);
        setJoinedUsers(joinedUsers.filter((user) => user.name !== data.name));
      });
  });

  const handleChatClick = (e) => {
    setSelectedTab('chat');
  };

  const handleUserClick = (e) => {
    setSelectedTab('user');
  };

  return (
    <div className='controller'>
      <div className='tab'>
        <div className='tabItem'>
          <button
            type='button'
            className={`btn btn-primary  ${
              selectedTab === 'chat' ? 'active' : ''
            }`}
            onClick={handleChatClick}
          >
            <i className='fa fa-comments'></i>
            Chat
          </button>
          <button
            type='button'
            className={`btn btn-primary  ${
              selectedTab === 'user' ? 'active' : ''
            }`}
            onClick={handleUserClick}
          >
            <i className='fa fa-users'></i>
            User List
          </button>
        </div>
        <div className='userName'>
          <i className='fa fa-user ' />
          <span>{clientId}</span>
        </div>
      </div>

      {selectedTab === 'chat' ? (
        <ChatWindow
          clientId={clientId}
          messageList={messageList}
          setMessageList={setMessageList}
        />
      ) : (
        <UserList joinedUsers={joinedUsers} />
      )}
    </div>
  );
}

export default ControlWindow;
