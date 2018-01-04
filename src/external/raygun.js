const raygun = require('raygun');

function loadRaygun(env) {
    const cfg = env.cfg.raygun;
    if (cfg) {
        env.raygun = new raygun.Client().init(cfg);
    }
}

module.exports = {
    loadRaygun,
};
