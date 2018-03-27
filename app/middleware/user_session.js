module.exports = () => {
  return async function userSession(ctx, next) {
    ctx.logger.debug('>middleware-> userSession');
    /* eslint-disable */
    const {
      app,
      cookies,
      request,
      header,
      session,
      service,
      path,
      ip,
      params,
      query,
      locals,
      hostname,
      protocol,
      helper,
    } = ctx;
    /* eslint-enable */
    if (session.user) {
      try {
        await next();
      } catch (err) {
        // if (err.code === 'user_status_invalid') {
        //   ctx.status = 401;
        //   const errCode = 100401;
        //   ctx.body = helper.resWrap(false, { member: { status } }, helper.codeMsg(errCode), errCode);
        // } else {
        //   throw err;
        // }
        throw err;
      }
    } else {
      ctx.status = 401;
      const errCode = 100401;
      ctx.body = helper.resWrap(
        false,
        undefined,
        helper.codeMsg(errCode),
        errCode
      );
    }
  };
};
