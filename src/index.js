const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const { assert } = require('chai');
const chalk = require('chalk');

const { logger } = require('./logging');
const configurator = require('./utilities/configurator');
const middlewares = require('./middlewares');

function middlewaresToString(orderedMiddlewares) {
    let str = `
    +${'-'.repeat(72)}+
    | ${chalk.bold.green('Rank')} | ${chalk.bold.green('Middleware'.padEnd(63))} |
    +${'-'.repeat(72)}+`;

    str = orderedMiddlewares.reduce((a, x) => {
        const [name, { rank }] = x;
        return `${a}
    | ${chalk.magenta(rank.toString().padStart(4))} | ${name.padEnd(63)} |`;
    }, str);
    str += `\n    +${'-'.repeat(72)}+\n`;

    return str;
}

class Environment {
    constructor(name) {
        assert.exists(name);

        this.name = name;
        this.log = logger(this.name);
        this.app = new Koa();
        this.router = new Router();
        this.middlewares = middlewares;

        const callerPath = path.dirname(module.parent.filename);
        this.cfg = configurator(this, callerPath);
    }

    get port() {
        if (!this.cfg.port) {
            throw new Error('Port has not been specified in the configuration.');
        }

        return this.cfg.port;
    }

    run() {
        const orderedMiddlewares = Object.entries(this.middlewares).sort((a, b) => a[1].rank - b[1].rank);
        this.app.listen(this.port);
        this.log.info(`Listening on port ${this.port} with the following stack:
            ${middlewaresToString(orderedMiddlewares)}`);
    }
}

module.exports = Environment;
