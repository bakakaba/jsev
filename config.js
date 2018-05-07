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
        sumologic: {
            collector: 'ZaVnC4dhaV20qZ8mnTh_8Nw5tFl6r2shgaMAvpsxDpe2_lSGmb8DXdvwsoRLI7B6LBOTi5m2z4aX1YyTTRZFZk5IY6wXrN_hOq7ybx0L_1idodlEl2tmBg==',
            endpoint: 'https://collectors.au.sumologic.com/receiver/v1/http/',
        },
    },
    port: 5000,
    raygun: {
        apiKey: '2o2ZbCaFpbHLry4mJfZtaQ==',
    },
    requestLogger: {
        logLevelOverrides: {
            debug: 'trace',
            info: 'debug',
        },
    },
};
