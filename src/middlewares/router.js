const graphql = require('koa-graphql');

module.exports = (env) => {
    if (env.cfg.graphql) {
        env.router.all(
            '/graphql',
            graphql(env.cfg.graphql),
        );

        const publicGraphql = Object.assign({}, env.cfg.graphql, { schema: env.cfg.graphql.publicSchema });
        env.router.all(
            '/public/graphql',
            graphql(publicGraphql),
        );
    }

    if (env.router.stack.length === 0) {
        return null;
    }

    return {
        func: env.router.routes(),
        rank: 90,
    };
};
