import React, { Component } from 'react';
import _ from 'lodash';
import socket from './connectionHandler/socket';
import PeerConnection from './connectionHandler/PeerConnection';
import MainWindow from './components/CallingWindow';
import CallWindow from './components/CallWindow';
import SnackBar from './components/SnackBar/index.tsx';

import './scss/app.scss';
class ApplicationWrapper extends Component {
  constructor() {
    super();
    this.state = {
      clientId: '',
      callWindow: '',
      callModal: '',
      callFrom: '',
      snackMessage: '',
      localSrc: null,
      peerSrc: null,
    };
    this.pc = {};
    this.config = null;
    this.startCallHandler = this.startCall.bind(this);
    this.endCallHandler = this.endCall.bind(this);
    this.rejectCallHandler = this.rejectCall.bind(this);
  }

  componentDidMount() {
    socket
      .on('signal', (data) => {
        if (data.sdp) {
          this.pc.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer')
            this.pc.createAnswer({ from: data?.from, to: data?.to });
        } else this.pc.addIceCandidate(data?.candidate);
      })

      .on('room', () => {
        this.config = null;
        this.setState({ peerSrc: null });
        this.handleSnackMessage(
          'Sorry! this room is busy! Please check some other room'
        );
      })

      .on('end', this.endCall.bind(this, false));
  }

  startCall({ usrName, roomId, config }) {
    this.config = config;

    this.pc = new PeerConnection(roomId)
      .on('localStream', (src) => {
        const newState = {
          callWindow: 'active',
          localSrc: src,
          callFrom: roomId,
          clientId: usrName,
        };
        if (!usrName) newState.callModal = '';
        this.setState(newState);
      })
      .on('peerStream', (src) => {
        setTimeout(() => {
          this.setState({ peerSrc: src });
        }, 1000);
      })

      .start({ usrName, roomId, config });
  }

  rejectCall() {
    const { callFrom, clientId } = this.state;
    socket.emit('end', { to: clientId });
    this.setState({ callModal: '' });
  }

  endCall(isStarter) {
    if (_.isFunction(this.pc.stop)) {
      this.pc.stop(isStarter);
    }
    this.pc = {};
    this.config = null;
    this.setState({
      callWindow: '',
      localSrc: null,
      peerSrc: null,
    });
  }

  handleSnackMessage = (message) => {
    this.setState({ snackMessage: message });
  };

  render() {
    const {
      clientId,
      callFrom,
      callWindow,
      localSrc,
      peerSrc,
      snackMessage,
    } = this.state;
    return (
      <>
        <SnackBar snackMsg={snackMessage} />
        <div className='rtcContainer'>
          {!peerSrc && _.isEmpty(this.config) && (
            <MainWindow
              clientId={clientId}
              startCall={this.startCallHandler}
              handleSnackMessage={this.handleSnackMessage}
            />
          )}
          {!_.isEmpty(this.config) && (
            <CallWindow
              status={callWindow}
              localSrc={localSrc}
              peerSrc={peerSrc}
              clientId={clientId}
              callFrom={callFrom}
              sendMessage={this.pc.messageHandler}
              config={this.config}
              mediaDevice={this.pc.mediaDevice}
              endCall={this.endCallHandler}
              handleSnackMessage={this.handleSnackMessage}
            />
          )}
        </div>
      </>
    );
  }
}

export default ApplicationWrapper;
