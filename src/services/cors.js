const cors = require('@koa/cors');

function load(env) {
    const cfg = env.cfg.cors || {};
    return cors(cfg);
}

module.exports = {
    load,
};
