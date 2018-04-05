const { exporter, typeCheck } = require('../utilities');

module.exports = (env) => {
    if (!env.cfg.services) {
        return null;
    }

    const cfg = env.cfg.services;

    const { log } = env;
    const serviceModules = exporter.exportModules(cfg.path);
    const services = Object.entries(serviceModules)
        .reduce((a, x) => {
            const [svcName, svcLoader] = x;

            if (!typeCheck.isFunction(svcLoader)) {
                log.warn(`Unable to load ${svcName}`);
                return a;
            }

            const svc = svcLoader(env);
            if (!svc) {
                log.debug(`${svcName} was not loaded`);
                return a;
            }

            a[svcName] = svc;
            log.info(`Loaded ${svcName}`);

            return a;
        }, {});

    return {
        func: (ctx, next) => {
            ctx.services = Object.entries(services)
                .reduce((a, x) => {
                    const [name, Svc] = x;
                    try {
                        a[name] = new Svc(ctx);
                    } catch (err) {
                        err.message = `Failed to load ${name}`;
                        throw err;
                    }

                    return a;
                }, {});

            return next();
        },
        rank: 20,
    };
};
