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

function exportModules(exportPath) {
    const normalizedExportPath = path.normalize(exportPath);
    const directoryContents = fs.readdirSync(normalizedExportPath);

    const directoryModules = directoryContents
        .filter((x) => fs.lstatSync(`${exportPath}/${x}`).isDirectory())
        .reduce((a, x) => {
            a[x] = require(`${exportPath}/${x}`);
            return a;
        }, {});

    const fileModules = directoryContents
        .map((f) => path.parse(`${normalizedExportPath}/${f}`))
        .filter((f) => f.name !== 'index' && jsExtensions.includes(f.ext))
        .reduce((a, x) => appendProperty(a, x.name, require(path.format(x))), {});

    return {
        ...directoryModules,
        ...fileModules,
    };
}

module.exports = {
    exportModules,
};
