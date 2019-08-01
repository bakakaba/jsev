import { Logger } from "../logging";

export interface IContext {
  [key: string]: object;
  log: Logger;
}
