import staticFiles from "koa-static";
import path from "path";

import { Environment } from "../Environment";

export default (env: Environment) => {
  const root = path.join(env.rootPath, "..", "static");
  env.log.info(`Static file path: ${root}`);
  return {
    func: staticFiles(root),
    rank: 3,
  };
};
