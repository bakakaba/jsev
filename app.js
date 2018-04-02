const { Environment } = require('./src');

const env = new Environment('app');

env.router.get('/public/hello', (ctx) => {
    ctx.body = 'hello world!!';
});

env.run();
