const { exportModules } = require('./exporter');

const modules = exportModules(__dirname);

module.exports = {
    ...modules,
    isFunction: modules.typeCheck.isFunction,
    isObject: modules.typeCheck.isObject,
};
