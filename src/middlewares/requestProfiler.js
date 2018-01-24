module.exports = () => ({
    func: async (ctx, next) => {
        const start = Date.now();
        try {
            await next();
        } finally {
            const ms = Date.now() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
        }
    },
    rank: 10,
});
