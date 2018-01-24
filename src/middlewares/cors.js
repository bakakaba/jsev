const cors = require('@koa/cors');

module.exports = (env) => {
    if (!env.cfg.cors) {
        return null;
    }

    const middleware = cors(env.cfg.cors);

    return {
        func: middleware,
        rank: 11,
    };
};
