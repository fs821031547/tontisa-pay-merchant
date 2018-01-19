module.exports = () => {
  const config = {
    logger: {
      consoleLevel: 'INFO', // 所有日志输出到控制台
    },
    redis: {
      default: {
      },
      app: true,
      agent: false,
      client: {
        port: 6379,          // Redis port
        host: 'redis',       // Redis host
        family: 4,           // 4 (IPv4) or 6 (IPv6)
        password: '@TTx.sider',
        db: 0,
      },
    },
    session: {
      key: 'EGG_SESS', // 'EGG_SESS' 默认值
      maxAge: 4 * 3600 * 1000, // 4小时 默认值
      // httpOnly: true, // true 默认值
      // encrypt: true, // true 默认值
    },
    apiConfig: {
      appHost: 'http://openapipre.op110.com.cn',
      appId: '999',
      appSecret: '999',
    },
    sessionIPs: [
      '114.215.222.221',
    ],
    qiniu: {
      accessKey: 'NZrTFjztBSRINUzLMYGRGtuxYBzbE8MeLTXoRgyy',
      secretKey: 'X9r5o7XThUKiXnlmstGIOAGiK-PiD5E5HRmHeJ__',
      mapping: {
        'tontisa-test-xqerp': {
          dn: 'https://ohp96o3wl.qnssl.com',
          isPrivate: 'false',
        },
      },
      bucket: 'tontisa-test-xqerp',
      returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
    },
    vfyPhoneKey: 'BK2088x>',
  };
  return config;
};
