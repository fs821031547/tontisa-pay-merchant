module.exports = () => {
  const config = {
    logger: {
      consoleLevel: 'DEBUG', // 所有日志输出到控制台
      level: 'NONE', // 关闭日志输出到文件
    },
    redis: {
      default: {},
      app: true,
      agent: false,
      client: {
        port: 6379, // Redis port
        host: '127.0.0.1', // Redis host
        family: 4, // 4 (IPv4) or 6 (IPv6)
        password: 'redisPass',
        db: 0,
      },
    },
    session: {
      maxAge: 3600 * 1000, // session 60 分钟过期
    },
    view: {
      cache: false,
    },
    apiConfig: {
      appHost: 'http://openapitest.op110.com.cn',
      appId: '888',
      appSecret: '888',
    },
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
      returnBody:
        '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
    },
    vfyPhoneKey: '2088',
  };
  return config;
};
