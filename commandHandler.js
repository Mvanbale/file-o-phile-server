const registry = require('./checksumRegistry');
const debug = require('debug')('server:commandHandler');
const fs = require('fs');
const util = require('./util');

module.exports.handleList = (command, socket) => {
  // process command
  const listObject = [];
  registry.forEach((el, key) => {
    listObject.push({
      'filename': key,
      'checksum': el[el.length - 1]
    });
  });
  const responseObject = {
    'status': 200,
    'files': listObject
  };

  // write out response
  debug({
    responseObject
  });
  socket.write(`RESPONSE idh14sync/1.0
${JSON.stringify(responseObject)}`);
};


module.exports.handlePut = (command, socket) => {
  debug('Handling put');
  debug(socket);
  // process command
  if (registry.has(command.info.filename)) {
    registry.get(command.info.filename).push(command.info.checksum);
  } else {
    registry.set(command.info.filename, [command.info.checksum]);
  }
  util.base64_decode(command.info.content, './filestore/' + command.info.filename);
  const responseObject = {
    'status': 200,
    'message': ' File added'
  };

  // write out response
  debug({
    responseObject
  });
  socket.write(`RESPONSE idh14sync/1.0
${JSON.stringify(responseObject)}`);
};

module.exports.handleGet = (command, socket) => {
  // process command

  // send response to client
  socket.write();
};

module.exports.handleDelete = (command, socket) => {
  // process command
  const responseObject = {
    'status': 200,
    'message': ' File deleted'
  };
  fs.unlink('./filestore/' + command.info.filename, (err) => {
    if (err) {
      debug(err);
      responseObject.message = err.message;
    }
    debug('Succesfully deleted ${command.info.filename}');
    socket.write(`RESPONSE idh14sync/1.0
${JSON.stringify(responseObject)}`);
  });
};