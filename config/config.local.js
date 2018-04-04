module.exports = () => {
  const config = {
    development: {
      ignoreDirs: [ 'node_modules', 'dockerfiles', 'app/view', 'app/public', 'logs', 'run' ],
    },
    logger: {
      consoleLevel: 'DEBUG', // 所有日志输出到控制台
      level: 'NONE', // 关闭日志输出到文件
    },
    redis: {
      default: {
      },
      app: true,
      agent: false,
      client: {
        port: 6379,          // Redis port
        host: '127.0.0.1', // Redis host
        family: 4,           // 4 (IPv4) or 6 (IPv6)
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
      // appHost: 'http://192.168.110.156:7100/newpay-service',
      appHost: 'http://192.168.110.156:9091',
      appId: '50001',
      appSecret: '999',
    },
    pubSerConfig: {
      appHost: 'http://vutest.op110.com.cn/util-service',
    },
    merchantConfig: {
      appHost: 'http://vutest.op110.com.cn/newpay-service',
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
      returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
    },
    vfyPhoneKey: '2088',
  };
  return config;
};
