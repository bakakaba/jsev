const path = require('path');

function loadConfiguration(cfgPath) {
    const cfg = require(path.join(cfgPath, 'config.js'));

    const env = process.env.NODE_ENV;
    if (!env) {
        return cfg;
    }

    const envCfg = require(path.join(cfgPath, `config.${env}.js`));
    return Object.assign({}, cfg, envCfg);
}

module.exports = loadConfiguration;