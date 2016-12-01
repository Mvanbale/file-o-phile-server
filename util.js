const Promise = require('bluebird');
const readFile = Promise.promisify(require("fs").readFile);
const writeFile = Promise.promisify(require("fs").writeFile);
const debug = require('debug')('server:util');

// function to encode file data to base64 encoded string
module.exports.base64_encode = (file)=> {
    // convert binary data to base64 encoded string
    debug('******** Encoded file to base64 encoded string ********');
    return new Buffer(file).toString('base64');
}

// function to create file from base64 encoded string
module.exports.base64_decode = (base64str, file) => {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    const bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    writeFile(file, bitmap).catch(debug);
    debug('******** File created from base64 encoded string ********');
    debug(file);
    debug(bitmap.length);
}

// generates our hash
const makeHash = (data) => {
  return Promise.try(()=>{
      return require('crypto').createHash('sha1').update(data).digest('hex');
  });
}

// gets the file content and shoves it into our makehash function, returns the hash
module.exports.getHashFromFile = (path) => {
  return readFile(path).then(makeHash);
}

// gets the file content and shoves it into our makehash function, returns the hash
module.exports.getFileContent = (path) => {
  return readFile(path).then(module.exports.base64_encode);
}