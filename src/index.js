const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const { assert } = require('chai');

const { Logger } = require('./logging');
const { defaultMiddlewares, applyMiddlewares } = require('./middlewares');
const utilities = require('./utilities');

class Environment {
    constructor(name) {
        assert.exists(name);

        this.name = name;
        this.app = new Koa();
        this.app.context.env = this;

        const callerPath = path.dirname(module.parent.filename);
        this.cfg = utilities.configurator.loadConfiguration(callerPath);

        this.log = new Logger(this);
        this.middlewares = defaultMiddlewares;

        this.router = new Router();
        this.app.on('error', (err) => {
            this.log.fatal(err);

            if (this.raygun) {
                // eslint-disable-next-line no-empty-function
                this.raygun.send(err, {}, () => {}, this.app.context.request, ['fatal']);
            }
        });
    }

    get port() {
        if (!this.cfg.port) {
            throw new Error('Port has not been specified in the configuration.');
        }

        return this.cfg.port;
    }

    run() {
        applyMiddlewares(this);

        this.app.listen(this.port);
        this.log.info(`Listening on port ${this.port} (${this.cfg.env})`);
    }
}

module.exports = {
    Environment,
    utilities,
};
