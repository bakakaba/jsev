/* eslint-disable no-process-env */

const raygun = require('raygun');

module.exports = (env) => {
    const cfg = env.cfg.raygun;

    if (!cfg) {
        return null;
    }

    const middleware = new raygun.Client().init(cfg);

    return {
        func: async (ctx, next) => {
            try {
                await next();
            } catch (err) {
                const tags = [ctx.env.name];
                if (process.env.NODE_ENV) {
                    tags.push(process.env.NODE_ENV);
                }
                middleware.send(err, {}, () => { }, ctx.request, tags); // eslint-disable-line no-empty-function

                throw err;
            }
        },
        rank: 2,
    };
};
