import Koa from "koa";
import Router from "koa-router";
import "reflect-metadata";

import { IConfiguration, loadConfiguration } from "./configuration";
import { InvalidOperationError } from "./errors";
import { createLogger, Logger } from "./logging";
import {
  applyMiddlewares,
  loadMiddlewares,
  MiddlewareFactory,
} from "./middlewares";
import { IObject } from "./types";

export class Environment {
  public readonly rootPath: string;
  public readonly app: Koa;
  public readonly router: Router;
  public readonly initPromise: Promise<void>;
  public cfg!: IConfiguration;
  public log!: Logger;
  public middlewares!: IObject<MiddlewareFactory>;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
    this.app = new Koa();
    this.app.context.env = this;
    this.router = new Router();

    this.initPromise = this.init(rootPath);
  }

  public async run() {
    await this.initPromise;

    if (!this.cfg) {
      throw new InvalidOperationError(
        "Unable to run without initializing the configuration.",
      );
    }

    await applyMiddlewares(this);

    this.app.listen(this.cfg.port);
    this.log.info(
      `${this.cfg.name} listening on port ${this.cfg.port} (${this.cfg.env})`,
    );
  }

  private async init(rootPath: string) {
    this.cfg = await loadConfiguration(rootPath);

    this.log = createLogger(this);
    this.app.on("error", (err) => {
      this.log.fatal(err);
    });

    this.middlewares = await loadMiddlewares(rootPath);
  }
}
