const jwt = require('koa-jwt');

function load(env) {
    const cfg = env.cfg.jwt || {};
    if (cfg.secret) {
        if (typeof cfg.secret === 'string') {
            cfg.secret = Buffer.from(cfg.secret, 'base64');
        } else if (cfg.secret instanceof Array) {
            cfg.secret = Buffer.from(cfg.secret);
        }
    }

    return jwt(cfg);
}

module.exports = {
    load,
};
