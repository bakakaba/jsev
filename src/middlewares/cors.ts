import cors from "@koa/cors";
import { Environment } from "../Environment";

export type ICorsOptions = cors.Options;

export default async (env: Environment) => {
  if (!env.cfg.cors) {
    return null;
  }

  const middleware = cors(env.cfg.cors);

  return {
    func: middleware,
    rank: 11,
  };
};
