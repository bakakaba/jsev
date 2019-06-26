import callsites from "callsites";
import { dirname } from "path";
import sourceMapSupport from "source-map-support";

import { Environment } from "./Environment";
import * as errors from "./errors";
import * as utilities from "./utilities";

export { default as gql } from "graphql-tag";

sourceMapSupport.install();
let env: Environment;
export function jsev() {
  if (!env) {
    const parent = callsites()[1];
    const callerPath = dirname(parent.getFileName()!);
    env = new Environment(callerPath);
  }

  return env;
}

export { errors, utilities };
