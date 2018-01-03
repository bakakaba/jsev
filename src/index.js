const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const { assert } = require('chai');

const { logger } = require('./logging');
const configurator = require('./utilities/configurator');
const middlewares = require('./middlewares');

class Environment {
    constructor(name) {
        assert.exists(name);

        this.app = new Koa();
        this.app.context.env = this;

        this.name = name;
        this.log = logger(this.name);

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

    setEndpointHandler(handler) {
        this.middlewares.endpoint = {
            func: handler,
            rank: 999,
        };
    }

    run() {
        this.middlewares.applyMiddlewares(this);
        this.app.listen(this.port);
        this.log.info(`Listening on port ${this.port}`);
    }
}

module.exports = Environment;
