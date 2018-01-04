module.exports = {
    func: async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            const { raygun } = ctx.env;
            if (raygun) {
                raygun.send(err, {}, () => {}, ctx.request); // eslint-disable-line no-empty-function
            }

            throw err;
        }
    },
    rank: 2,
};
