const exporter = require('./exporter');

function isObject(obj) {
    return obj instanceof Object && obj.constructor === Object;
}

function isFunction(obj) {
    return typeof obj === 'function';
}

module.exports = {
    ...exporter.exportModules(__dirname),
    isFunction,
    isObject,
};
