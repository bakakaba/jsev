module.exports = {
    func: (ctx, next) => {
        // By convention, we don't authenticate if the route is public and there is no authorization header
        if (ctx.url.match(/^\/public/) && !ctx.headers.authorization) {
            return next();
        }

        return ctx.services.jwt(ctx, next);
    },
    rank: 12,
};
