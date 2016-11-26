const debug = require('debug')('server:registerclient');
module.exports = (socket) => {
  debug(socket);
  // handle errors or socket closing
  socket.on('error', (err) => {
    debug('Socket closed');
    debug(err);
  });
  // hook up our data event to our manager
  socket.on('data', (data) => {
    debug(data.toString())
    let messages = data.toString().split(/(.*[A-Z] idh14sync.*\n\n)/g);
    debug(messages);
    messages = messages.filter(msg => msg.length);
    const mergedMessages = [];
    for (let x = 0; x < messages.length; x++) {
      if (x % 2 === 0) {
        mergedMessages.push({
          command: messages[x],
          json: messages[x + 1]
        });
      }
    }
    debug({
      mergedMessages
    });
    mergedMessages.map(parseMessage, socket);
  });
};


const parseMessage = (data, socket) => {
  let parsedData = {};
  if (data.command.indexOf('idh14sync/1.0') !== -1) {
    parsedData.command = data.command.split(' ')[0];
    debug('Sync protocol header recognized.');
    debug(`Command we found: ${parsedData.command}`);
  }
  try {
    parsedData.info = JSON.parse(data.json);
    debug('Decoding:')
    debug(data.json);
  } catch (err) {
    debug(err);
    debug('Failed to parse json object from message');
    return;
  }
  // commandHandler(parsedData, socket);
}