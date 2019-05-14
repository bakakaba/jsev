import { ApolloServer, gql } from "apollo-server-koa";
import { Environment } from "../Environment";

export default async (env: Environment) => {
  const middleware = env.router.routes();

  return {
    func: middleware,
    rank: 99,
  };
};
