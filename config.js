module.exports = {
    port: 5000,
    jwt: {
        secret: 'Super secret agent man!',
    },
    logger: {
        console: {
            showTime: false,
        },
        level: 'trace',
    },
    requestLogger: {
        logLevelOverrides: {
            debug: 'trace',
            info: 'debug',
        },
    },
};
