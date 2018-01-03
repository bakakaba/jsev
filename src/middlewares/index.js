const { exporter, isObject } = require('../utilities');

const builtinMiddlewares = exporter.exportModules(__dirname);

function loadMiddlewares(env) {
    env.middlewares = builtinMiddlewares;
}

function convertToTable(middlewares) {
    const table = {
        header: ['Rank', 'Middleware'],
        rows: [],
    };

    middlewares.forEach((x) => {
        const { name, rank } = x;
        table.rows.push([rank, name]);
    });

    return table;
}

function applyMiddlewares(env) {
    const middlewares = Object.entries(env.middlewares || builtinMiddlewares)
        .filter((x) => isObject(x[1]))
        .map((x) => Object.assign({}, x[1], { name: x[0] }))
        .sort((a, b) => a.rank - b.rank);

    middlewares.forEach((x) => env.app.use(x.func));

    env.log.info({ table: convertToTable(middlewares) }, 'Loaded middlewares');
}

module.exports = {
    applyMiddlewares,
    builtinMiddlewares,
    loadMiddlewares,
};
