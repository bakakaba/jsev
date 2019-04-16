import * as fs from 'fs';
import * as path from 'path';

import { IStringIndexedObject } from '../types';

const jsExtensions = [
    '.js',
    '.jsx',
];

function exportModules(exportPath: string) {
    const normalizedExportPath = path.normalize(exportPath);
    const directoryContents = fs.readdirSync(normalizedExportPath);

    const directoryModules: IStringIndexedObject<NodeRequire> = directoryContents
        .filter((x) => fs.lstatSync(`${exportPath}/${x}`).isDirectory())
        .reduce((a, x) => {
            a[x] = require(`${exportPath}/${x}`);
            return a;
        }, {} as IStringIndexedObject<NodeRequire>);

    const fileModules = directoryContents
        .map((f) => path.parse(`${normalizedExportPath}/${f}`))
        .filter((f) => f.name !== 'index'
            && jsExtensions.includes(f.ext)
            && !f.name.includes('.test'))
        .reduce((a, x) => {
            a[x.name] = require(path.format(x));
            return a;
        }, {} as IStringIndexedObject<NodeRequire>);

    return {
        ...directoryModules,
        ...fileModules,
    };
}

module.exports = {
    exportModules,
};
