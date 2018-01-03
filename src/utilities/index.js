const exporter = require('./exporter');

function isObject(obj) {
    return obj instanceof Object && obj.constructor === Object;
}

module.exports = {
    ...exporter.exportModules(__dirname),
    isObject,
};
