const { exporter, isFunction } = require('../utilities');

const defaultMiddlewares = exporter.exportModules(__dirname);

function convertToTable(middlewareList) {
    const table = {
        header: ['Rank', 'Middleware'],
        rows: [],
    };

    middlewareList.forEach((x) => {
        const { name, rank } = x;
        table.rows.push([rank, name]);
    });

    return table;
}

function convertMiddlewareToListItem(env, name, middleware) {
    if (!isFunction(middleware)) {
        return null;
    }

    const m = middleware(env);
    if (!m) {
        return null;
    }

    return Object.assign({ name }, m);
}

function applyMiddlewares(env) {
    const { app, middlewares, log } = env;
    const middlewareList = Object.entries(middlewares)
        .map((x) => convertMiddlewareToListItem(env, x[0], x[1]))
        .filter((x) => x)
        .sort((a, b) => a.rank - b.rank);

    middlewareList.forEach((x) => app.use(x.func));

    log.info({ table: convertToTable(middlewareList) }, `Loaded ${middlewareList.length} middlewares`);
}

module.exports = {
    applyMiddlewares,
    defaultMiddlewares,
};
