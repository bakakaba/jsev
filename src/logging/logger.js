const bunyan = require('bunyan');

const ConsoleStream = require('./consoleStream');

function createLogger(appName) {
    return bunyan.createLogger({
        name: appName,
        level: bunyan.TRACE,
        streams: [{
            type: 'raw',
            stream: new ConsoleStream()
        }]
    });
}

module.exports = createLogger;