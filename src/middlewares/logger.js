const shortId = require('shortid');

async function handler(ctx, next) {
    // Using snake_case for req_id as per Koa's recommendation
    // eslint-disable-next-line camelcase
    const log = ctx.env.log.child({ req_id: shortId.generate() }, true);
    ctx.log = log;

    log.info(`Request for ${ctx.URL.href}`);
    log.debug(`Request headers ${JSON.stringify(ctx.request.header)}`);

    await next();

    const responseTime = ctx.response.headers['x-response-time'];
    const responseTimeStr = responseTime
        ? ` in ${responseTime}`
        : '';
    log.info(`Request for ${ctx.URL.href} completed${responseTimeStr}`);
}

module.exports = {
    func: handler,
    rank: 1,
};
