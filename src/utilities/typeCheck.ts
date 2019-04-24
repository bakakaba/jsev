export function isFunction(obj: any) {
  return typeof obj === "function";
}

export function isObject(obj: any) {
  return obj instanceof Object && obj.constructor === Object;
}
