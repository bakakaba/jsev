const fs = require('fs');

function exportFiles(path) {
    const files = fs.readdirSync(path);
}

module.export = {
    exportFiles
};