import { ParameterizedContext } from "koa";

export default () => ({
  func: async (
    ctx: ParameterizedContext<any, {}>,
    next: () => Promise<any>,
  ) => {
    const start = Date.now();
    try {
      await next();
    } finally {
      const ms = Date.now() - start;
      ctx.set("X-Response-Time", `${ms}ms`);
    }
  },
  rank: 10,
});
