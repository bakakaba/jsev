const path = require('path');
const { assert } = require('chai');

const { exporter } = require('src/utilities');

describe('#exportModules(__dirname)', () => {
    it('should export module', () => {
        const modules = exporter.exportModules(__dirname);
        assert.containsAllKeys(modules, [path.basename(__filename, '.js')]);
    });
});
