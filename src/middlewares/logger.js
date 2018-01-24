const shortId = require('shortid');

async function handler(ctx, next) {
    const reqId = ctx.request.headers['x-response-time'] || shortId.generate();
    ctx.set('X-Request-Id', reqId);

    // Using snake_case for req_id as per Koa's recommendation
    // eslint-disable-next-line camelcase
    const log = ctx.env.log.child({ req_id: reqId }, true);
    ctx.log = log;

    log.info({ req: ctx.req }, `Request for ${ctx.URL.href}`);
    log.debug(`Request headers ${JSON.stringify(ctx.request.header)}`);

    try {
        await next();
    } catch (err) {
        log.error(err);
        const res = ctx.response;
        if (res.status !== 500) {
            res.status = 500;
            res.body = err.message;
        }
    }

    const responseTime = ctx.response.headers['x-response-time'];
    const responseTimeStr = responseTime
        ? ` in ${responseTime}`
        : '';
    log.info({ res: ctx.res }, `Request for ${ctx.URL.href} completed${responseTimeStr}`);
}

module.exports = () => ({
    func: handler,
    rank: 1,
});
