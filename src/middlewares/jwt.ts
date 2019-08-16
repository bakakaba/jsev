import { ParameterizedContext } from "koa";
import jwt from "koa-jwt";
import { Environment } from "../Environment";

export default (env: Environment) => {
  if (!env.cfg.jwt) {
    return null;
  }

  let cfg = env.cfg.jwt;
  if (cfg.secret) {
    if (typeof cfg.secret === "string") {
      const secret = Buffer.from(cfg.secret, "base64");
      cfg = {
        ...cfg,
        secret,
      };
    } else if (cfg.secret instanceof Array) {
      cfg.secret = Buffer.from(cfg.secret as any[]);
    }
  }

  const middleware = jwt(cfg);

  return {
    func: (ctx: ParameterizedContext<any, {}>, next: () => Promise<any>) =>
      middleware(ctx, next),
    rank: 5,
  };
};
