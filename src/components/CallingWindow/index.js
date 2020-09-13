import React, { useState } from 'react';
import socket from '../../connectionHandler/socket';
import PropTypes from 'prop-types';
import './CallingWindow.scss';

function CallingWindow({ startCall, clientId }) {
  const [roomId, setRoomID] = useState('');
  const [usrName, setUsrName] = useState('');

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => roomId && usrName && startCall({ usrName, roomId, config });
  };

  return (
    <div className='container main-window'>
      <div>
        <h4> Join Room</h4>
      </div>
      <div>
        <input
          type='text'
          className='txt-clientId'
          spellCheck={false}
          placeholder='Enter a Room ID'
          onChange={(event) => setRoomID(event.target.value)}
        />
        <input
          type='text'
          className='txt-clientId'
          spellCheck={false}
          placeholder='UserName'
          onChange={(event) => setUsrName(event.target.value)}
        />
        <div>
          <button
            type='button'
            className='btn-action fa fa-video-camera'
            onClick={callWithVideo(true)}
          ></button>
        </div>
      </div>
    </div>
  );
}

CallingWindow.propTypes = {
  clientId: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired,
};

export default CallingWindow;
