const Env = require('./src');

const env = new Env('app');

env.middlewares.endpoint = {
    func: (ctx) => {
        ctx.body = 'hello world!!';
    },
    rank: 99,
};

env.run();
