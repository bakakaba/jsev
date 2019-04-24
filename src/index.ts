import callsites from "callsites";
import { dirname } from "path";

import { Environment } from "./Environment";

let env: Environment;
export default () => {
  if (!env) {
    const parent = callsites()[1];
    const callerPath = dirname(parent.getFileName()!);
    env = new Environment(callerPath);
  }

  return env;
};

export * from "./errors";
