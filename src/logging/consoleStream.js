const _ = require('lodash');
const Stream = require('stream').Stream;
const util = require('util');
const chalk = require('chalk');
const bunyan = require('bunyan');

const defaultOptions = {
    omitFromDetails: ['name', 'hostname', 'pid', 'level', 'component', 'msg', 'time', 'v', 'src', 'err', 'client_req', 'client_res', 'req', 'res']
};

class ConsoleStream extends Stream {
    constructor(opts) {
        super();

        this.opts = Object.assign({}, defaultOptions, opts);
        this.readable = true;
        this.writable = true;
        this.pipe(process.stdout);
    }

    getDetails(data) {
        const details = _.omit(data, this.opts.omitFromDetails);
        const output = details && Object.keys(details).length > 0
            ? util.inspect(details, { colors: true })
            : '';

        return chalk.cyan(output);
    }

    getMessage(data) {
        const msg = data.msg;
        const lvl = data.level;

        if (lvl >= bunyan.FATAL) {
            return chalk.bgRed.white(msg);
        } else if (lvl >= bunyan.ERROR) {
            return chalk.red(msg);
        } else if (lvl >= bunyan.WARN) {
            return chalk.yellow(msg);
        } else if (lvl >= bunyan.INFO) {
            return chalk.white(msg);
        } else if (lvl >= bunyan.DEBUG) {
            return chalk.gray(msg);
        } else if (lvl >= bunyan.TRACE) {
            return chalk.green(msg);
        }

        return msg;
    }

    format(data) {
        const pid = chalk.gray(data.pid);
        const time = data.time.toISOString();
        const msg = this.getMessage(data);
        const details = this.getDetails(data);

        return `[${time} ${pid}] ${msg} ${details}\n`;
    }

    write(data) {
        const dataObj = typeof data === 'string'
            ? JSON.parse(data)
            : data;

        const output = this.format(dataObj);
        this.emit('data', output);

        return true;
    }

    end() {
        this.emit('end');
        return true;
    }
}

module.exports = ConsoleStream;
