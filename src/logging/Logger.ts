import bunyan from "bunyan";

import { LoggerOptions, Stream } from "bunyan";
import { Environment } from "../Environment";
import ConsoleStream from "./ConsoleStream";

export type ILoggerOptions = LoggerOptions;
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
    level: bunyan.INFO,
    name,
    serializers: bunyan.stdSerializers,
    streams,
    ...cfg,
  };

  // Delete so they are not logged
  delete bunyanCfg.console;

  const log = bunyan.createLogger(bunyanCfg);

  // Global unhandled error logging
  process.on("uncaughtException", (err) => {
    log.fatal(err, `Unrecoverable error from ${origin}, terminating`);
    process.exit(process.exitCode || 1);
  });

  return log;
}
