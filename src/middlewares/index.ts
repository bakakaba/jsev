import { Middleware } from "koa";

import { Environment } from "../Environment";
import { exportModulesSync, isFunction, notNullFilter } from "../utilities";

export interface IMiddleware {
  name: string;
  rank: number;
  func: Middleware;
  apply: () => void;
}

export type MiddlewareFactory = (env: Environment) => IMiddleware;

function convertToTable(middlewareList: IMiddleware[]) {
  const table = {
    header: ["Rank", "Middleware"],
    rows: [] as string[][],
  };

  middlewareList.forEach((x) => {
    const { name, rank } = x;
    table.rows.push([rank.toString(), name]);
  });

  return table;
}

async function convertMiddlewareToListItem(
  env: Environment,
  name: string,
  middleware: MiddlewareFactory,
): Promise<IMiddleware | void> {
  if (!isFunction(middleware)) {
    return;
  }

  const m = await middleware(env);
  if (!m) {
    return;
  }

  return { name, ...m };
}

export async function applyMiddlewares(env: Environment) {
  const { app, middlewares, log } = env;

  const mws = await Promise.all(
    Object.entries(middlewares).map(async (x) =>
      convertMiddlewareToListItem(env, x[0], x[1]),
    ),
  );

  const middlewareList = mws
    .filter(notNullFilter)
    .sort((a, b) => a.rank - b.rank);

  middlewareList.forEach((x) => {
    if (x.func) {
      app.use(x.func);
    } else {
      x.apply();
    }
  });

  log.info(
    { table: convertToTable(middlewareList) },
    `Loaded ${middlewareList.length} middlewares`,
  );
}

export default exportModulesSync<MiddlewareFactory>(__dirname);
