import {
  GraphQLFieldConfigMap,
  GraphQLFieldResolver,
  GraphQLInputType,
  GraphQLObjectType,
  GraphQLResolveInfo,
  Thunk,
} from "graphql";

import { IObject } from "../types/Object";

export function wrapResolveWithLogging(
  func: GraphQLFieldResolver<any, any>,
): GraphQLFieldResolver<any, any, GraphQLInputType> {
  return async (
    obj: object,
    args: GraphQLInputType,
    ctx: IObject<any>,
    info: GraphQLResolveInfo,
  ) => {
    try {
      let result = func(obj, args, ctx, info);
      if (result instanceof Promise) {
        result = await result;
      }

      return result;
    } catch (err) {
      ctx.log.error(err);
      throw err;
    }
  };
}

export function convertToGraphQLObject(
  name: string,
  obj: Thunk<GraphQLFieldConfigMap<any, any>>,
) {
  Object.values(obj).forEach((x) => {
    if (x.resolve) {
      x.resolve = wrapResolveWithLogging(x.resolve);
    }
  });

  return new GraphQLObjectType({
    fields: obj,
    name,
  });
}
