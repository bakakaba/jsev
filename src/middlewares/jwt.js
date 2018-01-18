module.exports = {
    func: (ctx, next) => ctx.services.jwt(ctx, next),
    rank: 12,
};
