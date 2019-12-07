import { ParameterizedContext } from "koa";

import { Environment } from "../Environment";
import { IObject } from "../types";
import { exportModulesSync, isFunction } from "../utilities";

export interface IServiceFactory<T extends object> {
  init: (env: Environment) => T;
}

export interface IServicesOptions {
  path: string;
}

export default (env: Environment) => {
  if (!env.cfg.services) {
    return null;
  }

  const cfg = env.cfg.services;

  const { log } = env;
  const serviceModules = exportModulesSync<IServiceFactory<object>>(cfg.path);
  const services = Object.entries(serviceModules).reduce((a, x) => {
    const [svcName, svcLoader] = x;

    if (!isFunction(svcLoader.init)) {
      log.warn(`No init function found for ${svcName}`);
      return a;
    }

    const svc = svcLoader.init(env);
    if (!svc) {
      log.debug(`${svcName} was not loaded`);
      return a;
    }

    a[svcName] = svc;
    log.info(`Loaded ${svcName}`);

    return a;
  }, {} as IObject<any>);

  return {
    func: (
      ctx: ParameterizedContext<any, { services: any }>,
      next: () => Promise<any>,
    ) => {
      ctx.services = Object.entries(services).reduce((a, x) => {
        const [name, Svc] = x;
        try {
          a[name] = new Svc(ctx);
        } catch (err) {
          err.message = `Failed to load ${name}`;
          throw err;
        }

        return a;
      }, {} as IObject<any>);

      return next();
    },
    rank: 20,
  };
};
