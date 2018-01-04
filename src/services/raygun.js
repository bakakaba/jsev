const raygun = require('raygun');

function load(env) {
    const cfg = env.cfg.raygun;
    return cfg ? new raygun.Client().init(cfg) : null;
}

module.exports = {
    load,
};
