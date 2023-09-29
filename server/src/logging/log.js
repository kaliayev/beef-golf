const bunyan = require('bunyan');
const log = bunyan.createLogger({
    name: 'golf-server',
    streams: [
        {
            type: 'rotating-file',
            path: './log/golf-server.log',
            period: '1w',   // weekly rotation
            count: 3        // keep 3 back copies
        },
        {
            stream: process.stdout
        }]
});

module.exports = log;