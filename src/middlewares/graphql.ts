import { GraphQLModule } from "@graphql-modules/core";
import { ApolloServer, gql } from "apollo-server-koa";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { Environment } from "../Environment";

const readdir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);
const exists = promisify(fs.exists);

async function loadModule(modulePath: string) {
  const info = await lstat(modulePath);
  if (!info.isDirectory()) {
    return null;
  }

  const gqlPath = path.join(modulePath, "graphql");
  if (!(await exists(gqlPath))) {
    return null;
  }

  const schema = await import(gqlPath);
  return new GraphQLModule(schema);
}

async function loadModules(rootPath: string) {
  const modulesPath = path.join(rootPath, "modules");
  const items = await readdir(modulesPath);

  const mods = await Promise.all(
    items.map((x) => loadModule(path.join(modulesPath, x))),
  );

  return mods.filter((x) => !!x) as GraphQLModule[];
}

export default async (env: Environment) => {
  const modules = await loadModules(env.rootPath);

  const appModule = new GraphQLModule({
    imports: modules,
  });

  const { schema, context } = appModule;
  const server = new ApolloServer({ schema, context });

  return {
    apply: () => server.applyMiddleware({ app: env.app }),
    rank: 98,
  };
};
