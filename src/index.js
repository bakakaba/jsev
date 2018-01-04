const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const { assert } = require('chai');

const { loadLogger } = require('./logging');
const { loadConfiguration } = require('./utilities/configurator');
const { loadMiddlewares, applyMiddlewares } = require('./middlewares');
const { loadRaygun } = require('./external/raygun');

class Environment {
    constructor(name) {
        assert.exists(name);

        this.name = name;
        this.app = new Koa();
        this.app.context.env = this;

        const callerPath = path.dirname(module.parent.filename);
        this.cfg = loadConfiguration(callerPath);

        loadLogger(this);
        loadMiddlewares(this);
        loadRaygun(this);

        this.router = new Router();
        this.app.on('error', (err) => {
            this.log.fatal(err);

            // eslint-disable-next-line no-empty-function
            this.raygun.send(err, {}, () => {}, this.app.context.request, ['fatal']);
        });
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
        applyMiddlewares(this);
        this.app.listen(this.port);
        this.log.info(`Listening on port ${this.port}`);
    }
}

module.exports = Environment;
