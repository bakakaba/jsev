import { exportModules } from "../utilities/exporter";

const modules = exportModules(__dirname);

export default {
  ...modules,
  isFunction: modules.typeCheck.isFunction,
  isObject: modules.typeCheck.isObject,
};
