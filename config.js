/* eslint-disable max-len */

module.exports = {
    jwt: {
        secret: 'Super secret agent man!',
    },
    logger: {
        console: {
            showTime: false,
        },
        level: 'trace',
    },
    port: 5000,
    requestLogger: {
        logLevelOverrides: {
            debug: 'trace',
            info: 'debug',
        },
    },
};
