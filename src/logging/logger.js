const bunyan = require('bunyan');

const ConsoleStream = require('./consoleStream');

function createLogger (appName) {
    return bunyan.createLogger({
        level: bunyan.TRACE,
        name: appName,
        streams: [
            {
                stream: new ConsoleStream(),
                type: 'raw',
            },
        ],
    });
}

module.exports = createLogger;
