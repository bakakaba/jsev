const shortId = require('shortid');

const { getPropertyByNameIgnoreCase } = require('../utilities').object;
const { ValidationError, UnauthorizedError } = require('../errors');

function handleError(log, response, error) {
    // Validation errors
    if (error instanceof ValidationError) {
        log.warn(error);
        response.status = 400;
        response.body = error.message;
        return;
    }

    // Unauthorized errors
    if (error instanceof UnauthorizedError) {
        log.warn(error);
        response.status = 401;
        response.body = error.message;
        return;
    }

    // Default error case
    log.error(error);
    if (response.status !== 500) {
        response.status = 500;
        response.body = error.message;
    }
}

async function handler(ctx, next) {
    const reqId = getPropertyByNameIgnoreCase(ctx.request.headers, 'X-Request-Id') || shortId.generate();
    ctx.set('X-Request-Id', reqId);

    // Using snake_case for req_id as per Koa's recommendation
    // eslint-disable-next-line camelcase
    const log = ctx.env.log.child({ req_id: reqId }, true);
    ctx.log = log;

    const { request, response } = ctx;
    log.debug(`Request for ${ctx.URL.href}`);
    log.debug(request.header, 'Request headers');
    if (request.body) {
        log.trace(ctx.request.body, 'Request body');
    }

    try {
        await next();
    } catch (err) {
        handleError(log, response, err);
    }

    const responseTime = getPropertyByNameIgnoreCase(ctx.response.headers, 'X-Response-Time');
    const responseTimeStr = responseTime
        ? ` in ${responseTime}`
        : '';
    log.debug({ res: ctx.res }, `Request for ${ctx.URL.href} completed${responseTimeStr}`);
}

module.exports = () => ({
    func: handler,
    rank: 1,
});
