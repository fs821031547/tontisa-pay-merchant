module.exports = () => {
  return async function logHandler(ctx, next) {
    ctx.logger.debug('>middleware-> logHandler');
    // 输出所有请求日志
    const { app, request, response, params, query, ip } = ctx;

    ctx.logger.info({ request, ip }, { body: JSON.stringify(request.body) }, { params }, { query });

    await next();

    const hres = {
      status: response.status,
      message: response.message,
      header: response.header,
    };
    const ct = response.header['content-type'];
    if (ct && ct.includes('text/html')) {
      ctx.logger.debug({ response: hres });
    } else {
      if (app.config.env === 'local') {
        ctx.logger.debug({ response: hres }, { body: JSON.stringify(ctx.body) });
      } else {
        ctx.logger.info({ response: hres });
      }
    }
  };
};
