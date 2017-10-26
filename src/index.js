const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');

const { logger } = require('./logging');
const configurator = require('./utilities/configurator');

class Environment {
    constructor(name) {
        this.name = name;
        this.log = logger(this.name);
        this.app = new Koa();
        this.router = new Router();

        const callerPath = path.dirname(module.parent.filename);
        this.cfg = configurator(callerPath);
    }

    get port() {
        if (!this.cfg.port) {
            throw 'Port has not been specified in the configuration.';
        }

        return this.cfg.port;
    }

    run() {
        const port = this.port;

        this.app.listen(port);
        this.log.info(`Listening on port ${port}`);
    }
}

module.exports = Environment;