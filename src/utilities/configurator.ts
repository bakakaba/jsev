/* Use console logging in here because we need to load the configuration before the logging module is usable */

import { merge } from "lodash";
import * as path from "path";

export async function loadConfiguration(cfgPath: string) {
  const cfg = await import(path.join(cfgPath, "config.js"));

  const envName = process.env.NODE_ENV;
  if (!envName) {
    return cfg;
  }

  cfg.env = envName;
  const envCfgName = `config.${envName}.js`;
  let envCfg = {};
  try {
    envCfg = await import(path.join(cfgPath, envCfgName));
  } catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") {
      throw err;
    }
    console.warn(`Environment configuration ${envCfgName} not found`); // tslint:disable-line:no-console
  }

  return merge(cfg, envCfg);
}
