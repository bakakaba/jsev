import * as bunyan from "bunyan";

import { LoggerOptions, Stream } from "bunyan";
import { Environment } from "../Environment";
import ConsoleStream from "./ConsoleStream";

const processSignals = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGQUIT: 3,
  SIGTERM: 15,
};

function bindProcessEventsListener(log: bunyan) {
  process.on("exit", (code) => {
    log.fatal(`Exit with code: ${code}`);
  });

  process.on("uncaughtException", (err) => {
    log.fatal(err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err, promise) => {
    const rejection = {
      err,
      promise,
    };
    log.error(rejection, "Unhandled promise rejection");
  });

  process.on("warning", (warning) => {
    log.warn(warning);
  });

  Object.entries(processSignals).forEach((x) => {
    process.on(x[0] as NodeJS.Signals, () => {
      log.fatal(`Received process signal ${x[0]}`);
      process.exit(128 + x[1]);
    });
  });
}

export class Logger extends bunyan {}

export function createLogger(env: Environment) {
  const { name, logger: cfg } = env.cfg;
  const consoleCfg = cfg ? cfg.console : undefined;

  const streams: Stream[] = [
    {
      stream: new ConsoleStream(consoleCfg),
      type: "raw",
    },
  ];

  const bunyanCfg: LoggerOptions = {
    ...cfg,
    level: bunyan.INFO,
    name,
    serializers: bunyan.stdSerializers,
    streams,
  };

  // Delete so they are not logged
  delete bunyanCfg.console;

  const log = bunyan.createLogger(bunyanCfg);
  bindProcessEventsListener(log);

  return log;
}
