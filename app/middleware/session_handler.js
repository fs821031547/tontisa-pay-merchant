module.exports = () => {
  return async function sessionHandler(ctx, next) {
    ctx.logger.debug('>middleware-> sessionHandler');
    const { app, cookies, request, header, session, service, path, ip, params, query, locals, hostname, protocol, helper } = ctx; // eslint-disable-line
    await next();
    if (app.config.env === 'local') {
      if (query.hasOwnProperty('session')) {
        ctx.body = ctx.session;
        return;
      }
    }
  };
};
