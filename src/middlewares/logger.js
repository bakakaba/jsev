const shortId = require('shortid');

async function handler(ctx, next) {
    const reqId = shortId.generate();
    ctx.set('X-Request-Id', reqId);

    // Using snake_case for req_id as per Koa's recommendation
    // eslint-disable-next-line camelcase
    const log = ctx.env.log.child({ req_id: reqId }, true);
    ctx.log = log;

    log.info({ req: ctx.req }, `Request for ${ctx.URL.href}`);
    log.debug(`Request headers ${JSON.stringify(ctx.request.header)}`);

    await next();

    const responseTime = ctx.response.headers['x-response-time'];
    const responseTimeStr = responseTime
        ? ` in ${responseTime}`
        : '';
    log.info({ res: ctx.res }, `Request for ${ctx.URL.href} completed${responseTimeStr}`);
}

module.exports = {
    func: handler,
    rank: 1,
};
