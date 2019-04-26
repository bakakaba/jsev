import { ParameterizedContext } from "koa";
import { Client, raygun } from "raygun";
import { Environment } from "../Environment";

export type IRaygunOptions = raygun.RaygunOptions;

export default (env: Environment) => {
  const cfg = env.cfg.raygun;

  if (!cfg) {
    return null;
  }

  const rg = new Client().init(cfg);

  return {
    func: async (
      ctx: ParameterizedContext<any, {}>,
      next: () => Promise<any>,
    ) => {
      try {
        await next();
      } catch (err) {
        const tags = [ctx.env.name];
        if (process.env.NODE_ENV) {
          tags.push(process.env.NODE_ENV);
        }
        rg.send(err, {}, undefined, ctx.request, tags);

        throw err;
      }
    },
    rank: 2,
  };
};
