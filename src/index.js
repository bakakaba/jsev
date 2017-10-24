const Koa = require('koa');
const Router = require('koa-router');
const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');

const pkg = require('../package');

const logStream = new PrettyStream();
logStream.pipe(process.stdout);

const log = bunyan.createLogger({
    name: pkg.name,
    streams: [{
        level: 'debug',
        type: 'raw',
        stream: logStream
    }]
});

const app = new Koa();
const router = new Router();

function init() {
    log.info('init');
}

function run() {
    log.info('run');
    app.use(router.routes());
    app.listen(4000);
    log.info({abc: 123, xyz: '456'}, '%s running', {test: 'hello'});
}

module.exports = {
    init,
    run,
};