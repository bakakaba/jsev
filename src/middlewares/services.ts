import { ParameterizedContext } from "koa";

import { Environment } from "../Environment";
import { IObject } from "../types";
import { exportModules, isFunction } from "../utilities";

export interface IServicesOptions {
  path: string;
}

export default (env: Environment) => {
  if (!env.cfg.services) {
    return null;
  }

  const cfg = env.cfg.services;

  const { log } = env;
  const serviceModules = exportModules(cfg.path);
  const services = Object.entries(serviceModules).reduce(
    (a, x) => {
      const [svcName, svcLoader] = x;

      if (!isFunction(svcLoader)) {
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
    },
    {} as IObject<any>,
  );

  return {
    func: (ctx: ParameterizedContext<any, {}>, next: () => Promise<any>) => {
      ctx.services = Object.entries(services).reduce(
        (a, x) => {
          const [name, Svc] = x;
          try {
            a[name] = new Svc(ctx);
          } catch (err) {
            err.message = `Failed to load ${name}`;
            throw err;
          }

          return a;
        },
        {} as IObject<any>,
      );

      return next();
    },
    rank: 20,
  };
};
