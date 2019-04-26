// Use console logging in here because we need to load the configuration before the logging module is usable

import { merge } from "lodash";
import { join } from "path";

import { ILoggerOptions } from "../logging";
import { ICorsOptions } from "../middlewares/cors";
import { IJWTOptions } from "../middlewares/jwt";
import { IRaygunOptions } from "../middlewares/raygun";
import { IServicesOptions } from "../middlewares/services";

export interface IConfiguration {
  name: string;
  port: number;
  env?: string;
  logger?: ILoggerOptions;
  cors: ICorsOptions;
  jwt: IJWTOptions;
  raygun: IRaygunOptions;
  services: IServicesOptions;
}

export async function loadConfiguration(cfgPath: string) {
  const defaultCfg = {
    name: "Default <Specify a name in the configuration>",
    port: 8080,
  };

  const cfg = [await import(join(cfgPath, "config.js"))];

  const envName = process.env.NODE_ENV;
  if (envName) {
    cfg[0].env = envName;
    const envCfgName = `config.${envName}.js`;
    try {
      cfg.push(await import(join(cfgPath, envCfgName)));
    } catch (err) {
      if (err.code !== "MODULE_NOT_FOUND") {
        throw err;
      }
      console.warn(`Environment configuration ${envCfgName} not found`); // tslint:disable-line:no-console
    }
  }

  return merge(defaultCfg, ...cfg) as IConfiguration;
}
