import { ApolloServer, gql } from "apollo-server-koa";
import { Environment } from "../Environment";

export default async (env: Environment) => {
  //   if (env.cfg.graphql) {
  //     env.router.all("/graphql", graphql(env.cfg.graphql));

  //     const publicGraphql = Object.assign({}, env.cfg.graphql, {
  //       schema: env.cfg.graphql.publicSchema,
  //     });
  //     env.router.all("/public/graphql", graphql(publicGraphql));
  //   }

  //   if (env.router.stack.length === 0) {
  //     return null;
  //   }

  // Construct a schema, using GraphQL schema language
  const typeDefs = gql`
    type Query {
      hello: String
    }
  `;

  // Provide resolver functions for your schema fields
  const resolvers = {
    Query: {
      hello: () => "Hello world!",
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app: env.app });

  return {
    func: env.router.routes(),
    rank: 98,
  };
};
