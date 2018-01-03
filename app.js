const Env = require('./src');

const env = new Env('app');
env.setEndpointHandler((ctx) => {
    ctx.body = 'hello world!!';
});

env.run();
