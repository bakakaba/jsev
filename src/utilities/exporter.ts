import fs from "fs";
import path from "path";
import { promisify } from "util";

import { IObject } from "../types/Object";

const readdir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);
const DEFAULT_EXTENSIONS = [".js", ".jsx"];

async function exportModule<T>(
  modulePath: string,
  name: string,
  extensions: string[],
): Promise<[string, T] | void> {
  const fullPath = `${modulePath}/${name}`;
  const info = await lstat(fullPath);

  if (info.isDirectory()) {
    return [name, await import(fullPath)];
  }

  const parsedPath = path.parse(fullPath);
  if (
    parsedPath.name !== "index" &&
    extensions.includes(parsedPath.ext) &&
    !parsedPath.name.includes(".test")
  ) {
    let mod = await import(fullPath);
    if (mod.default) {
      mod = mod.default;
    }

    return [parsedPath.name, mod];
  }
}

export async function exportModules<T>(exportPath: string, extensions = DEFAULT_EXTENSIONS) {
  const normalizedExportPath = path.normalize(exportPath);
  const directoryContents = await readdir(normalizedExportPath);

  const modulePromises = directoryContents.map((x) =>
    exportModule<T>(normalizedExportPath, x, extensions),
  );

  const modules: IObject<T> = {};
  for (const m of modulePromises) {
    const loaded = await m;

    if (!loaded) {
      continue;
    }

    const [name, mod] = loaded;
    modules[name] = mod;
  }

  return modules;
}

export function exportModulesSync<T>(exportPath: string, extensions = DEFAULT_EXTENSIONS) {
  const normalizedExportPath = path.normalize(exportPath);
  const directoryContents = fs.readdirSync(normalizedExportPath);

  const modules = directoryContents.reduce(
    (a, x) => {
      const fullPath = `${normalizedExportPath}/${x}`;
      const info = fs.lstatSync(fullPath);
      const parsedPath = path.parse(fullPath);

      if (info.isDirectory()) {
        if (parsedPath.name !== "__tests__") {
          a[x] = require(fullPath);
        }

        return a;
      }

      if (
        parsedPath.name !== "index" &&
        extensions.includes(parsedPath.ext) &&
        !parsedPath.name.includes(".test")
      ) {

        let mod = require(fullPath);
        if (mod.default) {
          mod = mod.default;
        }

        a[parsedPath.name] = mod;
      }

      return a;
    },
    {} as IObject<T>,
  );

  return modules;
}
