import MediaDevice from './MediaDevice';
import Emitter from './Emitter';
import socket from './socket';

const PC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

class PeerConnection extends Emitter {
  /**
   * Create a PeerConnection.
   * @param {String} friendID - ID of the friend you want to call.
   */
  constructor(friendID) {
    super();
    this.pc = new RTCPeerConnection(PC_CONFIG);

    this.to = friendID; //roomID

    // once remote stream arrives, show it in the remote video element

    this.pc.onicecandidate = (event) => {
      socket.emit('signal', {
        to: friendID,
        candidate: event.candidate,
      });
    };
    //new
    this.pc.onnegotiationneeded = function () {
      console.log('on negotiation called');
      this.createOffer();
    };

    //ens
    this.pc.ontrack = (event) => {
      this.emit('peerStream', event.streams[0]);
    };

    this.mediaDevice = new MediaDevice();
    this.friendID = friendID;
  }

  /**
   * Starting the call
   * @param {Boolean} isCaller
   * @param {Object} config - configuration for the call {audio: boolean, video: boolean}
   */
  start(data) {
    this.mediaDevice
      .on('stream', (stream) => {
        stream.getTracks().forEach((track) => {
          this.pc.addTrack(track, stream);
        });
        this.emit('localStream', stream);

        this.to = data.roomId;
        this.from = data.usrName;
        if (data.usrName) {
          this.call();
        } else this.createOffer(data.roomId);
      })
      .start(data.config);

    return this;
  }

  /**
   * Stop the call
   * @param {Boolean} isStarter
   */
  stop(isStarter) {
    if (isStarter) {
      socket.emit('end', { to: this.friendID });
    }
    this.mediaDevice.stop();
    this.pc.close();
    this.pc = null;
    this.off();
    return this;
  }

  createOffer() {
    this.pc
      .createOffer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  call() {
    this.pc
      .createOffer()
      .then(this.getVideo.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  createAnswer({ from, to }) {
    this.from = from;
    this.to = to;
    this.pc
      .createAnswer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  getDescription(desc) {
    this.pc.setLocalDescription(desc);
    socket.emit('adduser', { to: this.friendID, from: this.from, sdp: desc });
    return this;
  }

  getVideo(desc) {
    this.pc.setLocalDescription(desc);
    socket.emit('adduser', { to: this.to, from: this.from, sdp: desc });
    return this;
  }

  /**
   * @param {Object} sdp - Session description
   */
  setRemoteDescription(sdp) {
    const rtcSdp = new RTCSessionDescription(sdp);
    this.pc.setRemoteDescription(rtcSdp);
    return this;
  }

  /**
   * @param {Object} candidate - ICE Candidate
   */
  addIceCandidate(candidate) {
    console.log(candidate);
    if (candidate) {
      const iceCandidate = new RTCIceCandidate(candidate);
      this.pc.addIceCandidate(iceCandidate);
    }
    return this;
  }
}

export default PeerConnection;
