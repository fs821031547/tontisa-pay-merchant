const path = require('path');
module.exports = {
  sessionRedis: {
    enable: true,
    package: 'egg-session-redis',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  validate: {
    enable: true,
    path: path.join(__dirname, '../app/plugin/egg-validate'),
  },
  gm: {
    enable: true,
    path: path.join(__dirname, '../app/plugin/egg-gm'),
  },
};
