// Use console logging in here because we need to load the configuration before the logging module is usable

import { merge } from "lodash";
import { join } from "path";

import { Options as JWTOptions } from "koa-jwt";
import { ILoggerOptions } from "../logging";
import { ICorsOptions } from "../middlewares/cors";
import { IServicesOptions } from "../middlewares/services";

export interface IConfiguration {
  name: string;
  port: number;
  env?: string;
  logger?: ILoggerOptions;
  cors: ICorsOptions;
  jwt: JWTOptions;
  services: IServicesOptions;
}

export async function loadConfiguration(cfgPath: string) {
  const env = process.env.NODE_ENV;
  const defaultCfg = {
    env,
    name: process.env.name || "app",
    port: 8080,
  };

  const cfg = [await import(join(cfgPath, "config.js"))];

  if (env) {
    const envCfgName = `config.${env}.js`;
    try {
      cfg.push(await import(join(cfgPath, envCfgName)));
    } catch (err) {
      if (err.code !== "MODULE_NOT_FOUND") {
        throw err;
      }
      console.warn(`Environment configuration ${envCfgName} not found`); // tslint:disable-line:no-console
    }
  }

  return merge(
    defaultCfg,
    ...cfg.map((x) => (x.default ? x.default : x)),
  ) as IConfiguration;
}
