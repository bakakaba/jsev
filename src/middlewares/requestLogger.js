const shortId = require('shortid');

const { getPropertyByNameIgnoreCase } = require('../utilities').object;

async function handler(ctx, next) {
    const cfg = ctx.env.cfg.requestLogger || {};


    const reqId = getPropertyByNameIgnoreCase(ctx.request.headers, 'X-Request-Id') || shortId.generate();
    ctx.set('X-Request-Id', reqId);

    // Using snake_case for req_id as per Koa's recommendation
    // eslint-disable-next-line camelcase
    const log = ctx.env.log.child({ req_id: reqId }, true);
    ctx.log = log;

    const levelOverrides = cfg.logLevelOverrides || {};
    const levels = {
        debug: levelOverrides.debug || 'debug',
        error: levelOverrides.error || 'error',
        info: levelOverrides.info || 'info',
    };

    log[levels.info]({ req: ctx.req }, `Request for ${ctx.URL.href}`);
    log[levels.debug](`Request headers ${JSON.stringify(ctx.request.header)}`);

    try {
        await next();
    } catch (err) {
        log[levels.error](err);
        const res = ctx.response;
        if (res.status !== 500) {
            res.status = 500;
            res.body = err.message;
        }
    }

    const responseTime = getPropertyByNameIgnoreCase(ctx.response.headers, 'X-Response-Time');
    const responseTimeStr = responseTime
        ? ` in ${responseTime}`
        : '';
    log[levels.info]({ res: ctx.res }, `Request for ${ctx.URL.href} completed${responseTimeStr}`);
}

module.exports = () => ({
    func: handler,
    rank: 1,
});
