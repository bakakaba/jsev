/* eslint-disable no-sync, global-require */
const fs = require('fs');
const path = require('path');

const jsExtensions = [
    '.js',
    '.jsx',
];

function appendProperty(obj, propName, value) {
    obj[propName] = value;
    return obj;
}

function exportModules() {
    const callerPath = path.dirname(module.parent.filename);
    const files = fs.
        readdirSync(callerPath).
        map((f) => path.parse(`${callerPath}/${f}`)).
        filter((f) => f.name !== 'index' && jsExtensions.includes(f.ext));

    const modules = files.
        reduce((a, x) => appendProperty(a, x.name, require(path.format(x))), {});

    return modules;
}

module.exports = { exportModules };
