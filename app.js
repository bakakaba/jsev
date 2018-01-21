const { Environment } = require('./src');

const env = new Environment('app');

env.middlewares.endpoint = {
    func: (ctx) => {
        ctx.body = 'hello world!!';
    },
    rank: 99,
};

env.run();
