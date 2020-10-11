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
      const { from, to } = data;
      const handleAddUser = () => {
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

        socket.to(to).broadcast.emit('newUser', { name: from });
        // echo to room 1 that a person has connected to their room
      };

      if (!rooms[to]) {
        rooms[to] = [from];
        handleAddUser(data);
      } else if (rooms[to].length === 1) {
        rooms[to] = [...rooms[to], from];
        handleAddUser(data);
      } else {
        socket.emit('room');
      }
    })
    .on('sendchat', function (data) {
      // we tell the client to execute 'updatechat' with 2 parameters
      socket.broadcast
        .to(socket.room)
        .emit('updatechat', data.clientId, data.message);
    })

    .on('end', (data) => {
      const receiver = data.to;
      if (receiver) {
        socket.to(receiver).emit('userLeft', { name: socket.username });
      }
    })

    .on('signal', (data) => {
      // console.log(
      //   'sending signal from ' + socket.username + ' to ',
      //   socket.room
      // );

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
