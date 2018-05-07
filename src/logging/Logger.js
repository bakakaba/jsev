const bunyan = require('bunyan');
const SumoLogger = require('bunyan-sumologic');

const ConsoleStream = require('./ConsoleStream');

const processSignals = {
    SIGHUP: 1,
    SIGINT: 2,
    SIGQUIT: 3,
    SIGTERM: 15,
};

function bindProcessEventsListener(log) {
    /* eslint-disable no-process-exit */
    process.on('exit', (code) => {
        log.fatal(`Exit with code: ${code}`);
    });

    process.on('uncaughtException', (err) => {
        log.fatal(err);
        process.exit(1);
    });

    process.on('unhandledRejection', (err, promise) => {
        const rejection = {
            err,
            promise,
        };
        log.error(rejection, 'Unhandled promise rejection');
    });

    process.on('warning', (warning) => {
        log.warn(warning);
    });

    Object.entries(processSignals)
        .forEach((x) => {
            process.on(x[0], () => {
                log.fatal(`Received process signal ${x[0]}`);
                process.exit(128 + x[1]);
            });
        });
    /* eslint-enable no-process-exit */
}

function Logger(env) {
    const cfg = env.cfg.logger;

    const streams = [
        {
            stream: new ConsoleStream(cfg.console),
            type: 'raw',
        },
    ];

    if (cfg.sumologic) {
        streams.push({
            stream: new SumoLogger(cfg.sumologic),
            type: 'raw',
        });
    }

    const bunyanCfg = {
        level: bunyan.INFO,
        name: env.name,
        serializers: bunyan.stdSerializers,
        streams,
        ...cfg,
    };

    // Delete known properties so they are not logged
    delete bunyanCfg.sumologic;
    delete bunyanCfg.console;

    const log = bunyan.createLogger(bunyanCfg);
    bindProcessEventsListener(log);

    return log;
}

module.exports = Logger;
