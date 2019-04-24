import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

import { IObject } from "../types/Object";

const readdir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);
const jsExtensions = [".js", ".jsx"];

async function exportModule(
  modulePath: string,
  name: string,
): Promise<[string, object] | void> {
  const fullPath = `${modulePath}/${name}`;
  const info = await lstat(fullPath);

  if (info.isDirectory()) {
    return [name, await import(fullPath)];
  }

  const parsedPath = path.parse(fullPath);
  if (
    parsedPath.name !== "index" &&
    jsExtensions.includes(parsedPath.ext) &&
    !parsedPath.name.includes(".test")
  ) {
    return [name, await import(fullPath)];
  }
}

export async function exportModules(exportPath: string) {
  const normalizedExportPath = path.normalize(exportPath);
  const directoryContents = await readdir(normalizedExportPath);

  const modules = directoryContents
    .map((x) => exportModule(normalizedExportPath, x))
    .reduce(
      async (a, x) => {
        const loaded = await x;
        if (!loaded) {
          return a;
        }

        const [name, mod] = loaded;
        a[name] = mod;
        return a;
      },
      {} as IObject<any>,
    );

  return modules;
}
