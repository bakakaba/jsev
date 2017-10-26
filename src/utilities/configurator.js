const _ = require('lodash');
const path = require('path');

function loadConfiguration(env, cfgPath) {
    const cfg = require(path.join(cfgPath, 'config.js'));

    const envName = process.env.NODE_ENV;
    if (!envName) {
        return cfg;
    }

    const envCfgName = `config.${envName}.js`;
    let envCfg = {};
    try {
        envCfg = require(path.join(cfgPath, envCfgName));
    } catch (err) {
        if (err.code !== 'MODULE_NOT_FOUND') {
            throw err;
        }
        env.log.warn(`Environment configuration ${envCfgName} not found`);
    }

    return _.merge(cfg, envCfg);
}

module.exports = loadConfiguration;