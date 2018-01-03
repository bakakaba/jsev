/* Use console logging in here because we need to load the configuration before the logging module is usable */
/* eslint-disable global-require, no-process-env, no-console */
const _ = require('lodash');
const path = require('path');

function loadConfiguration(cfgPath) {
    const cfg = require(path.join(cfgPath, 'config.js'));

    const envName = process.env.NODE_ENV;
    if (!envName) {
        return cfg;
    }

    cfg.env = envName;
    const envCfgName = `config.${envName}.js`;
    let envCfg = {};
    try {
        envCfg = require(path.join(cfgPath, envCfgName));
    } catch (err) {
        if (err.code !== 'MODULE_NOT_FOUND') {
            throw err;
        }
        console.warn(`Environment configuration ${envCfgName} not found`);
    }

    return _.merge(cfg, envCfg);
}

module.exports = {
    loadConfiguration,
};
