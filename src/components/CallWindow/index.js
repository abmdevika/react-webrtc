import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import WaitingScreen from '../WaitingScreen';
import ControlWindow from './ControlWindow';
import './CallWindow.scss';
const getButtonClass = (icon, enabled) =>
  classnames(`btn-action fa ${icon}`, { disable: !enabled });

function CallWindow({
  peerSrc,
  localSrc,
  config,
  mediaDevice,
  status,
  clientId,
  endCall,
  handleSnackMessage,
}) {
  const peerVideo = useRef(null);
  const localVideo = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);

  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  });

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle('Video', video);
      mediaDevice.toggle('Audio', audio);
    }
  });

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === 'video') {
      setVideo(!video);
      mediaDevice.toggle('Video');
    }
    if (deviceType === 'audio') {
      setAudio(!audio);
      mediaDevice.toggle('Audio');
    }
  };

  return (
    <div className={classnames('call-window', status)}>
      <div className='chatPeer'>
        <div className='peerContainer'>
          <div className='peerVideo'>
            {<WaitingScreen />}
            <video id='peerVideo' ref={peerVideo} autoPlay />
          </div>
          <div className='video-control'>
            <button
              key='btnVideo'
              type='button'
              className={getButtonClass('fa-video-camera', video)}
              onClick={() => toggleMediaDevice('video')}
            />
            <button
              key='btnAudio'
              type='button'
              className={getButtonClass('fa-microphone', audio)}
              onClick={() => toggleMediaDevice('audio')}
            />
            <button
              type='button'
              className='btn-action hangup fa fa-phone'
              onClick={() => endCall(true)}
            />
          </div>
        </div>

        <ControlWindow
          clientId={clientId}
          handleSnackMessage={handleSnackMessage}
        />
      </div>

      <div className='userVideo'>
        <video id='localVideo' ref={localVideo} autoPlay muted />
      </div>
    </div>
  );
}

CallWindow.propTypes = {
  status: PropTypes.string.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  config: PropTypes.shape({
    audio: PropTypes.bool.isRequired,
    video: PropTypes.bool.isRequired,
  }).isRequired,
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired,
};

export default CallWindow;
