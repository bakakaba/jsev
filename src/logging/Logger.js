const bunyan = require('bunyan');
const SumoLogger = require('bunyan-sumologic');

const ConsoleStream = require('./ConsoleStream');

class Logger {
    constructor(env) {
        const streams = [
            {
                stream: new ConsoleStream(),
                type: 'raw',
            },
        ];

        if (env.cfg.sumologic) {
            streams.push({
                stream: new SumoLogger(env.cfg.sumologic),
                type: 'raw',
            });
        }

        const cfg = Object.assign({
            level: bunyan.INFO,
            name: env.name,
            serializers: bunyan.stdSerializers,
            streams,
        }, env.cfg.logger);

        return bunyan.createLogger(cfg);
    }
}

module.exports = Logger;
