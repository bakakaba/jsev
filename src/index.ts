import * as Koa from 'koa';
import * as Router from 'koa-router';
// const Router = require('koa-router');
// const path = require('path');
import { assert } from 'chai';

// const { Logger } = require('./logging');
// const { defaultMiddlewares, applyMiddlewares } = require('./middlewares');
// const utilities = require('./utilities');
// const errors = require('./errors');

export default class Environment {
    app: Koa;
    router: Router;
    name: string;

    constructor(name: string) {
        assert.exists(name);

        this.name = name;
        this.app = new Koa();
        //     this.app.context.env = this;

        //     const callerPath = path.dirname(module.parent.filename);
        //     this.cfg = utilities.configurator.loadConfiguration(callerPath);

        //     this.log = new Logger(this);
        //     this.middlewares = defaultMiddlewares;

        this.router = new Router();
        //     this.app.on('error', (err) => {
        //         this.log.fatal(err);

        //         if (this.raygun) {
        //             // eslint-disable-next-line no-empty-function
        //             this.raygun.send(err, {}, () => {}, this.app.context.request, ['fatal']);
        //         }
        //     });
    }

    // get port() {
    //     if (!this.cfg.port) {
    //         throw new Error('Port has not been specified in the configuration.');
    //     }

    //     return this.cfg.port;
    // }

    get port(): number {
        // if (!this.cfg.port) {
        //     throw new Error('Port has not been specified in the configuration.');
        // }

        // return this.cfg.port;
        return 3000;
    }

    run() {
        //     applyMiddlewares(this);

        this.app.listen(this.port);
        //     this.log.info(`Listening on port ${this.port} (${this.cfg.env})`);
    }
}

// module.exports = {
//     Environment,
//     errors,
//     utilities,
// };
