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

    let publicRoutes = [/^\/public/, /^\/favicon.ico/];
    if (cfg.publicRoutes) {
        publicRoutes = publicRoutes.concat(cfg.publicRoutes);
    }

    function isPublicRoute(url) {
        if (publicRoutes.some((x) => !!url.match(x))) {
            return true;
        }

        return false;
    }

    const middleware = jwt(cfg);

    return {
        func: (ctx, next) => {
            // By convention, we don't authenticate if the route is public and there is no authorization header
            if (!ctx.headers.authorization && isPublicRoute(ctx.url)) {
                return next();
            }

            return middleware(ctx, next);
        },
        rank: 12,
    };
};
