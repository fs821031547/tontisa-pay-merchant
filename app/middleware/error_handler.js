module.exports = () => {
  return async function errorHandler(ctx, next) {
    ctx.logger.debug('>middleware-> errorHandler');
    try {
      await next();
    } catch (err) {
      if (err.code === 'invalid_param') {
        ctx.app.emit('error', err, ctx);
        ctx.status = 400;
        ctx.body = ctx.helper.resWrap(false, err.errors, err.message, 100400);
      } else if (err.code === 'api_fail_res') {
        ctx.app.emit('error', err, ctx);
        ctx.status = 502;
        ctx.body = ctx.helper.resWrap(false, err.errors, err.message, 100502);
      } else {
        throw err;
      }
    }

    if (ctx.status === 404 &&
        !ctx.body &&
        ctx.params &&
        ctx.params.storeId) {

      if (ctx.acceptJSON) {
        ctx.body = ctx.helper.resWrap(false, undefined, ctx.helper.codeMsg(100404), 100404);
      } else {
        ctx.redirect(`/${ctx.params.storeId}/404`);
      }
    }
  };
};
