const http = require('http');
const path = require('path');
const express = require('express');
const config = require('../config');
const socket = require('./lib/socket');

const app = express();
const server = http.createServer(app);
const publicPath = path.join(__dirname, '../..', 'build');

app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

server.listen(config.PORT, () => {
  socket(server);
  console.log('Server is listening at :', config.PORT);
});
