import { ParameterizedContext } from "koa";
import jwt from "koa-jwt";
import { Environment } from "../Environment";

export interface IJWTOptions extends jwt.Options {
  publicRoutes: RegExp[];
}

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
      cfg.secret = Buffer.from(cfg.secret);
    }
  }

  let publicRoutes = [/^\/public/, /^\/favicon.ico/];
  if (cfg.publicRoutes) {
    publicRoutes = publicRoutes.concat(cfg.publicRoutes);
  }

  function isPublicRoute(url: string) {
    if (publicRoutes.some((x) => !!url.match(x))) {
      return true;
    }

    return false;
  }

  const middleware = jwt(cfg);

  return {
    func: (ctx: ParameterizedContext<any, {}>, next: () => Promise<any>) => {
      if (isPublicRoute(ctx.url)) {
        return next();
      }

      return middleware(ctx, next);
    },
    rank: 12,
  };
};
