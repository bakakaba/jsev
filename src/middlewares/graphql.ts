import { GraphQLModule } from "@graphql-modules/core";
import { ApolloServer } from "apollo-server-koa";
import fs from "fs";
import path from "path";
import { promisify } from "util";

import { Environment } from "../Environment";
import { InvalidOperationError } from "../errors";

interface IModuleSchema {
  typeDefs: any;
  resolvers: {};
  imports?: [string];
}

interface ISchemaSet {
  [key: string]: IModuleSchema;
}

interface IModuleSet {
  [key: string]: GraphQLModule;
}

const readdir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);
const exists = promisify(fs.exists);

async function loadSchema(modulePath: string) {
  const info = await lstat(modulePath);
  if (!info.isDirectory()) {
    return null;
  }

  const gqlPath = path.join(modulePath, "graphql");
  if (!(await exists(gqlPath))) {
    return null;
  }

  const schema = await import(gqlPath);
  return schema as IModuleSchema;
}

async function loadModule(
  modules: IModuleSet,
  schemas: ISchemaSet,
  moduleName: string,
) {
  let mod = modules[moduleName];
  if (mod) {
    return mod;
  }

  const { imports, resolvers, typeDefs } = schemas[moduleName];
  let importedModules;
  if (imports) {
    // Load dependant modules 1 at a time so that the same dependency is linked to a single instance
    importedModules = await imports.reduce(async (a, x) => {
      const list = await a;
      const depMod = await loadModule(modules, schemas, x);
      if (!depMod) {
        throw new InvalidOperationError(
          `Module ${moduleName} depends on module ${x} which was not found, please check your graphql dependencies.`,
        );
      }

      list.push(depMod);

      return list;
    }, Promise.resolve([] as GraphQLModule[]));
  }

  mod = new GraphQLModule({
    imports: importedModules,
    resolvers,
    typeDefs,
  });

  modules[moduleName] = mod;
  return mod;
}

async function loadModules(rootPath: string) {
  const modulesPath = path.join(rootPath, "modules");
  const items = await readdir(modulesPath);

  const schemas = await items.reduce(async (a, x) => {
    const list = await a;
    const sch = await loadSchema(path.join(modulesPath, x));
    if (sch) {
      list[x] = sch;
    }

    return list;
  }, Promise.resolve({} as ISchemaSet));

  // Load modules 1 at a time as it may already be loaded as a dependency
  const schemaKeys = Object.keys(schemas);
  const modules = await schemaKeys.reduce(async (a, x) => {
    const mods = await a;
    const mod = await loadModule(mods, schemas, x);
    if (mod) {
      mods[x] = mod;
    }

    return mods;
  }, Promise.resolve({} as IModuleSet));

  return Object.values(modules);
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
