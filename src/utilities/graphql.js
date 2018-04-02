const { GraphQLObjectType } = require('graphql');

function wrapResolveWithLogging(func) {
    return async (obj, args, ctx) => {
        try {
            let result = func(obj, args, ctx);
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

function convertToGraphQLObject(name, obj) {
    Object.values(obj)
        .forEach((x) => {
            if (x.resolve) {
                x.resolve = wrapResolveWithLogging(x.resolve);
            }
        });
    return new GraphQLObjectType({
        fields: obj,
        name,
    });
}

module.exports = {
    convertToGraphQLObject,
    wrapResolveWithLogging,
};
