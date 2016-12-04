const debug = require('debug')('server:registerclient');
const commandHandler = require('./commandHandler');

module.exports = (socket) => {
  let openingBracketCount = 0;
  let closingBracketCount = 0;
  let dataBuffer = '';
  // handle errors or socket closing
  socket.on('error', (err) => {
    debug('Socket closed');
    debug(err);
  });
  // hook up our data event to our manager
  socket.on('data', (data) => {
    data = data.toString();
    dataBuffer += data;
    openingBracketCount += (data.match('{') || []).length;
    closingBracketCount += (data.match('}') || []).length;
    if (!openingBracketCount || !(openingBracketCount === closingBracketCount)) {
      debug(`Missing some brackets, so waiting for more data, ${openingBracketCount}, ${closingBracketCount}`);
      return;
    }
    openingBracketCount = 0;
    closingBracketCount = 0;
    debug('equal amount of brackets');
    debug(1);
    const lastFoundBracket = dataBuffer.lastIndexOf('}') + 1;
        debug(2);
        let message = dataBuffer.slice(0, lastFoundBracket);
        debug(3);
    message = message.split('\n\n').filter(msg => msg.length);
    debug('saf');
    message = {command: message[0], json: message[1]};
    debug('Sending message to parsemessage');
    debug(message.command);
    parseMessage(message, socket);
    dataBuffer = dataBuffer.slice(lastFoundBracket);
  });
};


const parseMessage = (data, socket) => {
  let parsedData = {};
  debug(data.command);
  if (data.command.indexOf('idh14sync/1.0') !== -1) {
    parsedData.command = data.command.split(' ')[0];
    debug('Sync protocol header recognized.');
    debug(`Command we found: ${parsedData.command}`);
  }
  try {
    parsedData.info = JSON.parse(data.json);
    debug('Decoding:')
  } catch (err) {
    debug(err);
    debug('Failed to parse json object from message');
    return;
  }
  switch (parsedData.command) {
    case 'PUT':
      commandHandler.handlePut(parsedData, socket);
      break;
    case 'LIST':
      commandHandler.handleList(parsedData, socket);
      break;
    case 'GET':
      commandHandler.handleGet(parsedData, socket);
      break;
    case 'DELETE':
      commandHandler.handleDelete(parsedData, socket);
      break;
    default:
      break;
  }
}