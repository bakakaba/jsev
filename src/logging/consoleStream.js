/* eslint-disable class-methods-use-this */

const _ = require('lodash');
const { Stream } = require('stream');
const util = require('util');
const chalk = require('chalk');
const bunyan = require('bunyan');

const defaultOptions = {
    omitFromDetails: [
        'name',
        'hostname',
        'pid',
        'level',
        'component',
        'msg',
        'time',
        'v',
        'src',
        'err',
        'client_req',
        'client_res',
        'req',
        'res',
        'req_id',
        'table',
    ],
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
        const { msg, level: lvl } = data;

        if (lvl >= bunyan.FATAL) {
            return chalk.bgRed.white(`FTL: ${msg}`);
        } else if (lvl >= bunyan.ERROR) {
            return chalk.redBright(`ERR: ${msg}`);
        } else if (lvl >= bunyan.WARN) {
            return chalk.yellow(`WRN: ${msg}`);
        } else if (lvl >= bunyan.INFO) {
            return chalk.white(`INF: ${msg}`);
        } else if (lvl >= bunyan.DEBUG) {
            return chalk.gray(`DBG: ${msg}`);
        } else if (lvl >= bunyan.TRACE) {
            return chalk.green(`TRC: ${msg}`);
        }

        return msg;
    }

    getTable(data) {
        const { table } = data;
        if (!table) {
            return '';
        }

        const widths = [];
        const padDirections = [];
        for (let i = 0; i < table.header.length; i++) {
            let dir = 0;
            const len = table.rows.reduce((a, x) => {
                const cLen = x[i].toString().length;
                if (!dir) {
                    dir = isNaN(Number(x[i])) ? 1 : -1;
                }

                return a > cLen ? a : cLen;
            }, table.header[i].length);

            widths.push(len);
            padDirections.push(dir);
        }

        const tWidth = widths.reduce((a, x) => a + x + 2, 1);
        const header = table.header
            .reduce((a, x, i) => `${a} ${chalk.bold.green(x.toString().padEnd(widths[i]))} |`, '|');

        const rows = table.rows
            .reduce((ra, row, ri) => {
                const r = row.reduce((a, x, i) => {
                    let c = x;
                    if (isNaN(Number(x))) {
                        c = c.toString().padEnd(widths[i]);
                    } else {
                        c = chalk.magenta(c.toString().padStart(widths[i]));
                    }
                    return `${a} ${c} |`;
                }, '|');

                const startRow = ri === 0 ? '\t' : '\n\t';
                return `${ra}${startRow}${r}`;
            }, '');

        const str = `
\t+${'-'.repeat(tWidth)}+
\t${header}
\t+${'-'.repeat(tWidth)}+
${rows}
\t+${'-'.repeat(tWidth)}+
`;

        return str;
    }

    getError(data) {
        return data.err
            ? chalk.red(`\n${data.err.stack}`)
            : '';
    }

    format(data) {
        const pid = chalk.gray(data.pid);
        const reqId = data.req_id ? ` ${chalk.cyan(data.req_id)}` : '';
        const time = data.time.toISOString();
        const msg = this.getMessage(data);
        const details = this.getDetails(data);
        const table = this.getTable(data);
        const error = this.getError(data);


        return `[${time} ${pid + reqId}] ${msg}${table}${error} ${details}\n`;
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
