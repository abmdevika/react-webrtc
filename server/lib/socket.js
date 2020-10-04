const io = require('socket.io');

/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */
function initSocket(socket) {
  let userNames = {};
  let rooms = {};

  socket

    // when the client emits 'adduser', this listens and executes
    .on('adduser', function (data) {
      console.log('user add', data.from, data.to);
      const { from, to } = data;
      // store the username in the socket session for this client
      socket.username = from;
      // store the room name in the socket session for this client
      socket.room = to;
      // add the client's username to the global list
      userNames[from] = from;
      // send client to room 1
      socket.join(to);

      socket.to(to).broadcast.emit('signal', {
        ...data,
      });
      // socket.emit('video', { ...data, from });
      // echo to client they've connected
      socket.emit('updatechat', 'SERVER', 'you have connected to room=>' + to);
      // echo to room 1 that a person has connected to their room
      socket.broadcast
        .to(to)
        .emit('updatechat', 'SERVER', from + ' has connected to this room');
      socket.emit('updaterooms', rooms, to);
    })
    .on('sendchat', function (data) {
      console.log(data, socket.room, socket.username);
      // we tell the client to execute 'updatechat' with 2 parameters
      socket.broadcast
        .to(socket.room)
        .emit('updatechat', data.clientId, data.message);
    })

    .on('end', (data) => {
      const receiver = data.to;
      if (receiver) {
        socket.to(receiver).emit('end');
      }
    })

    .on('signal', (data) => {
      console.log(
        'sending signal from ' + socket.username + ' to ',
        socket.room
      );

      socket.to(socket.room).broadcast.emit('signal', {
        from: socket.username,
        to: socket.room,
        ...data,
      });
    })

    .on('disconnect', () => {
      delete userNames[socket.username];
      console.log('disconnected', socket.username);
    });
}

module.exports = (server) => {
  io({ path: '/bridge', serveClient: false })
    .listen(server, { log: true })
    .on('connection', initSocket);
};
