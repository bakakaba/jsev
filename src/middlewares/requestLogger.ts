import { ParameterizedContext, Response } from "koa";
import * as shortId from "shortid";

import { UnauthorizedError, ValidationError } from "../errors";
import { Logger } from "../logging";
import { getPropertyByNameIgnoreCase } from "../utilities";

function handleError(log: Logger, response: Response, error: Error) {
  // Validation errors
  if (error instanceof ValidationError) {
    log.warn(error);
    response.status = 400;
    response.body = error.message;
    return;
  }

  // Unauthorized errors
  if (error instanceof UnauthorizedError) {
    log.warn(error);
    response.status = 401;
    response.body = error.message;
    return;
  }

  // Default error case
  log.error(error);
  if (response.status !== 500) {
    response.status = 500;
    response.body = error.message;
  }
}

async function handler(
  ctx: ParameterizedContext<any, {}>,
  next: () => Promise<any>,
) {
  const reqId =
    getPropertyByNameIgnoreCase(ctx.request.headers, "X-Request-Id") ||
    shortId.generate();
  ctx.set("X-Request-Id", reqId);

  // Using snake_case for req_id as per Koa's recommendation
  const log = ctx.env.log.child({ req_id: reqId }, true);
  ctx.log = log;

  const { request, response } = ctx;
  log.info(`Request for ${ctx.URL.href}`);
  log.debug(request.header, "Request headers");

  try {
    await next();
  } catch (err) {
    handleError(log, response, err);
  }

  const responseTime = getPropertyByNameIgnoreCase(
    ctx.response.headers,
    "X-Response-Time",
  );
  const responseTimeStr = responseTime ? ` in ${responseTime}` : "";
  log.info(
    { res: ctx.res },
    `Request for ${ctx.URL.href} completed${responseTimeStr}`,
  );
}

export default () => ({
  func: handler,
  rank: 1,
});
