const net = require('net');
const debug = require('debug')('server:server');
const config = require('config');
const port = config.get('server').port;
const registerClient = require('./registerClient');

debug('Port we are registering on:' + port);
console.log('server.js');
const server = net.createServer(registerClient);
server.listen(port, function() {
    debug('Server is now listening');
});

server.on('error', debug)