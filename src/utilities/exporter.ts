import * as fs from "fs";
import * as path from "path";

import { IObject } from "../types/Object";

const jsExtensions = [".js", ".jsx"];

export function exportModules(exportPath: string) {
  const normalizedExportPath = path.normalize(exportPath);
  const directoryContents = fs.readdirSync(normalizedExportPath);

  const directoryModules = directoryContents
    .filter((x) => fs.lstatSync(`${exportPath}/${x}`).isDirectory())
    .reduce(
      async (a, x) => {
        a[x] = require(`${exportPath}/${x}`);
        return a;
      },
      {} as IObject<any>,
    );

  const fileModules = directoryContents
    .map((f) => path.parse(`${normalizedExportPath}/${f}`))
    .filter(
      (f) =>
        f.name !== "index" &&
        jsExtensions.includes(f.ext) &&
        !f.name.includes(".test"),
    )
    .reduce(
      (a, x) => {
        a[x.name] = require(path.format(x));
        return a;
      },
      {} as IObject<any>,
    );

  return {
    ...directoryModules,
    ...fileModules,
  };
}
