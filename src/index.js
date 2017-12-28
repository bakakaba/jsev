const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const { assert } = require('chai');

const { logger } = require('./logging');
const configurator = require('./utilities/configurator');

class Environment {
    constructor(name) {
        assert.exists(name);

        this.name = name;
        this.log = logger(this.name);
        this.app = new Koa();
        this.router = new Router();

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
        this.app.listen(this.port);
        this.log.info(`Listening on port ${this.port}`);
    }
}

module.exports = Environment;
