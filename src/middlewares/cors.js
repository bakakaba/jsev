module.exports = {
    func: (ctx, next) => ctx.services.cors(ctx, next),
    rank: 11,
};
