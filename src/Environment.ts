import Koa from "koa";
import Router from "koa-router";

// const { defaultMiddlewares, applyMiddlewares } = require('./middlewares');

import {
  IConfiguration,
  loadConfiguration,
} from "./configuration";
import { InvalidOperationError } from "./errors";
import { createLogger, Logger } from "./logging";

export class Environment {
  public app: Koa;
  public router: Router;
  public cfg!: IConfiguration;
  public log!: Logger;

  public initPromise: Promise<void>;

  constructor(rootPath: string) {
    this.app = new Koa();
    this.app.context.env = this;
    this.router = new Router();

    //     this.middlewares = defaultMiddlewares;

    // console.log("root", rootPath);

    //     this.app.on('error', (err) => {
    //         this.log.fatal(err);

    //         if (this.raygun) {
    //             // eslint-disable-next-line no-empty-function
    //             this.raygun.send(err, {}, () => {}, this.app.context.request, ['fatal']);
    //         }
    //     });
    this.initPromise = this.init(rootPath);
  }

  public async run() {
    await this.initPromise;

    if (!this.cfg) {
      throw new InvalidOperationError(
        "Unable to run without initializing the configuration.",
      );
    }

    //     applyMiddlewares(this);

    this.app.listen(this.cfg.port);
    this.log.info(
      `${this.cfg.name} listening on port ${this.cfg.port} (${this.cfg.env})`,
    );
  }

  private async init(rootPath: string) {
    this.cfg = await loadConfiguration(rootPath);
    this.log = createLogger(this);
  }
}
