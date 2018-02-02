const jwt = require('koa-jwt');

module.exports = (env) => {
    if (!env.cfg.jwt) {
        return null;
    }

    let cfg = env.cfg.jwt;
    if (cfg.secret) {
        if (typeof cfg.secret === 'string') {
            const secret = Buffer.from(cfg.secret, 'base64');
            cfg = {
                ...cfg,
                secret,
            };
        } else if (cfg.secret instanceof Array) {
            cfg.secret = Buffer.from(cfg.secret);
        }
    }

    const middleware = jwt(cfg);

    return {
        func: (ctx, next) => {
            // By convention, we don't authenticate if the route is public and there is no authorization header
            if (ctx.url.match(/^\/public/) && !ctx.headers.authorization) {
                return next();
            }

            return middleware(ctx, next);
        },
        rank: 12,
    };
};
