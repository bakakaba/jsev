/* eslint-disable no-process-env */

module.exports = {
    func: async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            const { raygun } = ctx.services;
            if (raygun) {
                const tags = [ctx.env.name];
                if (process.env.NODE_ENV) {
                    tags.push(process.env.NODE_ENV);
                }
                raygun.send(err, {}, () => {}, ctx.request, tags); // eslint-disable-line no-empty-function
            }

            throw err;
        }
    },
    rank: 2,
};
