import { IObject } from "../types";

export function getPropertyByNameIgnoreCase(obj: IObject<any>, name: string) {
  const nName = name.toLocaleLowerCase();
  const key = Object.keys(obj).find((x) => x.toLocaleLowerCase() === nName);

  return key ? obj[key] : undefined;
}

export function isFunction(obj: any) {
  return typeof obj === "function";
}

export function isObject(obj: any) {
  return obj instanceof Object && obj.constructor === Object;
}
