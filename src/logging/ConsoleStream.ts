import { DEBUG, ERROR, FATAL, INFO, TRACE, WARN } from "bunyan";
import chalk from "chalk";
import { omit } from "lodash";
import { Writable, WritableOptions, Duplex } from "stream";
import { inspect } from "util";

import { IObject } from "../types/Object";

interface IConsoleStreamOptions extends WritableOptions {
  omitFromDetails: string[];
  showProcess: boolean;
  showTime: boolean;
}

interface ITable {
  header: string[];
  rows: string[][];
}

interface IData {
  req_id: string;
  pid: string;
  msg: string;
  level: number;
  time: Date;
  err?: Error;
  table: ITable;
}

const defaultOptions: IConsoleStreamOptions = {
  omitFromDetails: [
    "name",
    "hostname",
    "pid",
    "level",
    "component",
    "msg",
    "time",
    "v",
    "src",
    "err",
    "client_req",
    "client_res",
    "req",
    "res",
    "req_id",
    "table",
  ],
  showProcess: true,
  showTime: true,
};

export default class ConsoleStream extends Writable implements NodeJS.WritableStream {
  private opts: IConsoleStreamOptions;

  constructor(opts?: IConsoleStreamOptions) {
    super();

    this.opts = { ...defaultOptions, ...opts };
  }

  public write(data: string | Buffer) {
    const dataObj = typeof data === "string" ? JSON.parse(data) : data;

    const output = this.format(dataObj);

    /* tslint:disable:no-console */
    if (dataObj.level < INFO) {
      console.log(output);
    } else if (dataObj.level < WARN) {
      console.info(output);
    } else if (dataObj.level < ERROR) {
      console.warn(output);
    } else {
      console.error(output);
    }
    /* tslint:enable:no-console */

    return true;
  }

  private getDetails(data: IData) {
    const details = omit(data, this.opts.omitFromDetails);
    const output =
      details && Object.keys(details).length > 0
        ? inspect(details, { colors: true })
        : "";

    return chalk.cyan(output);
  }

  private getMessage(data: IData) {
    const { msg, level } = data;

    if (level >= FATAL) {
      return chalk.bgRed.white(`FTL: ${msg}`);
    } else if (level >= ERROR) {
      return chalk.redBright(`ERR: ${msg}`);
    } else if (level >= WARN) {
      return chalk.yellow(`WRN: ${msg}`);
    } else if (level >= INFO) {
      return chalk.white(`INF: ${msg}`);
    } else if (level >= DEBUG) {
      return chalk.gray(`DBG: ${msg}`);
    } else if (level >= TRACE) {
      return chalk.green(`TRC: ${msg}`);
    }

    return msg;
  }

  private getTable(data: IData) {
    const { table } = data;
    if (!table) {
      return "";
    }

    const widths: number[] = [];
    const padDirections = [];
    for (let i = 0; i < table.header.length; i++) {
      let dir = 0;
      const len = table.rows.reduce((a, x) => {
        const cLen = x[i].toString().length;
        if (!dir) {
          dir = isNaN(Number(x[i])) ? 1 : -1;
        }

        return a > cLen ? a : cLen;
      }, table.header[i].length);

      widths.push(len);
      padDirections.push(dir);
    }

    const tWidth = widths.reduce((a, x) => a + x + 2, 1);
    const header = table.header.reduce(
      (a, x, i) => `${a} ${chalk.bold.green(x.toString().padEnd(widths[i]))} |`,
      "|",
    );

    const rows = table.rows.reduce((ra, row, ri) => {
      const r = row.reduce((a, x, i) => {
        let c = x;
        if (isNaN(Number(x))) {
          c = c.toString().padEnd(widths[i]);
        } else {
          c = chalk.magenta(c.toString().padStart(widths[i]));
        }
        return `${a} ${c} |`;
      }, "|");

      const startRow = ri === 0 ? "\t" : "\n\t";
      return `${ra}${startRow}${r}`;
    }, "");

    const str = `
\t+${"-".repeat(tWidth)}+
\t${header}
\t+${"-".repeat(tWidth)}+
${rows}
\t+${"-".repeat(tWidth)}+
`;

    return str;
  }

  private getError(data: IData) {
    return data.err ? chalk.red(`\n${data.err.stack}`) : "";
  }

  private format(data: IData) {
    const pid = this.opts.showProcess ? ` ${chalk.gray(data.pid)}` : "";
    const reqId = data.req_id ? ` ${chalk.cyan(data.req_id)}` : "";
    const time = this.opts.showTime ? data.time.toISOString() : "";
    const msg = this.getMessage(data);
    const details = this.getDetails(data);
    const table = this.getTable(data);
    const error = this.getError(data);

    const info = time + pid + reqId;

    return `[${info.trim()}] ${msg}${table}${error} ${details}`;
  }
}
