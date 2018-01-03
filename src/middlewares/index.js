const chalk = require('chalk');
const { exporter, isObject } = require('../utilities');

const defaultMiddlewares = exporter.exportModules(__dirname);

function print(log, middlewares) {
    let str = `Loaded the following middlewares:
    +${'-'.repeat(72)}+
    | ${chalk.bold.green('Rank')} | ${chalk.bold.green('Middleware'.padEnd(63))} |
    +${'-'.repeat(72)}+`;

    str = middlewares.reduce((a, x) => {
        const { name, rank } = x;
        return `${a}
    | ${chalk.magenta(rank.toString().padStart(4))} | ${name.padEnd(63)} |`;
    }, str);
    str += `\n    +${'-'.repeat(72)}+\n`;

    log.info(str);
}

function applyMiddlewares(env) {
    const middlewares = Object.entries(env.middlewares || defaultMiddlewares)
        .filter((x) => isObject(x[1]))
        .map((x) => Object.assign({}, x[1], { name: x[0] }))
        .sort((a, b) => a.rank - b.rank);

    middlewares.forEach((x) => env.app.use(x.func));

    print(env.log, middlewares);
}

module.exports = Object.assign({}, defaultMiddlewares, { applyMiddlewares });
