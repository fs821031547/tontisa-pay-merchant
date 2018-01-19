const path = require('path');
const fs = require('fs');
module.exports = appInfo => {
  const config = {
    keys: appInfo.name + '_1490759207216_4573', // should change to your own
    session: {
      key: 'MERCHANT_PAY_SESS',
      maxAge: 24 * 3600 * 1000, // 1 天
      httpOnly: false,
    },
    static: {
      prefix: '/',
    },
    siteFile: {
      '/favicon.ico': fs.readFileSync(path.join(process.cwd(), '/app/public/favicon.ico')),
    },
    view: {
      mapping: {
        '.njk': 'nunjucks',
      },
      defaultViewEngine: 'nunjucks',
      defaultExtension: '.njk',
    },
    notfound: {
      pageUrl: '/404.html',
    },
    logger: {
      dir: path.join(appInfo.baseDir, 'logs'),
    },
    proxy: true,
    security: {
      csrf: {
        enable: false,
      },
    },
    middleware: [ 'logHandler', 'errorHandler', 'sessionHandler' ],
  };
  return config;
};
