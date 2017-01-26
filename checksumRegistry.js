const ourChecksums = new Map();
module.exports = ourChecksums;
const debug = require('debug')('file-o-phile:checksumRegistry');
setInterval(() => {
    debug({ ourChecksums });
}, 5000);