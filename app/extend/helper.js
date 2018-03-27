const crypto = require('crypto');
const moment = require('moment');
const qiniu = require('qiniu');
const codes = require('../codes');
module.exports = {
  /**
   * [resWrap 响应提包裹处理，将响应内容转换成统一的标准格式]
   * @param  {[type]} success  [业务是否成功]
   * @param  {[type]} datas    [成功后的业务数据]
   * @param  {String} [msg=''] [失败的消息提示]
   * @param  {[type]} code     [业务代码]
   * @param  {[type]} meta     [添加其他元数据]
   * @return {[type]}          [标准结构的响应内容]
   */
  resWrap(success, datas, msg = '', code, meta) {
    const wrap = {
      meta: {
        success,
      },
    };
    if (success) {
      wrap.data = datas;
      wrap.meta.code = 200;
    } else {
      wrap.meta.message = msg;
      wrap.meta.code = code;
      wrap.error = datas;
    }
    if (meta) {
      Object.assign(wrap.meta, meta);
    }
    return wrap;
  },

  /**
   * [modelNamed 用于自定义ModelService父类时的，转换子类Model名称]
   * @param  {[type]} named [子类Model名称]
   * @return {[type]}       [子类Model名称首字母变成大写]
   */
  modelNamed(named) {
    named = named || '';
    return named.charAt(0).toUpperCase() + named.slice(1);
  },

  /**
   * 将第二个参数的page数据或者默认值设置给第一个参数对象
   * @param  {[type]} obj   被设置page数据的对象
   * @param  {[type]} paged 包含page数据的对象，若没有则会给obj设置默认数据
   * @param  {[type]} def   设置page数据的默认值可以配置，pageNo 默认为 1，pageSize 默认为 10，pageSizeMax 默认为 500
   * @return {[type]}       返回带page数据的obj对象
   */
  pageLead(
    obj = {},
    paged = {},
    def = { pageNo: 1, pageSize: 10, pageSizeMax: 500 }
  ) {
    let pageNo = def.pageNo;
    if (paged.hasOwnProperty('pageNo')) {
      pageNo = Number(paged.pageNo);
      pageNo = Number.isNaN(pageNo) ? def.pageNo : pageNo;
      pageNo = pageNo < def.pageNo ? def.pageNo : pageNo;
    }
    obj.pageNo = pageNo;
    let pageSize = def.pageSize;
    if (paged.hasOwnProperty('pageSize')) {
      pageSize = Number(paged.pageSize);
      pageSize = Number.isNaN(pageSize) ? def.pageSize : pageSize;
      pageSize = pageNo > def.pageSizeMax ? def.pageSizeMax : pageSize;
    }
    obj.pageSize = pageSize;
    return obj;
  },

  /**
   * 生成查询日期参数
   * @param  {[type]} data 被转换的数据
   * @param  {[type]} def  默认值，若没有数据使用默认值，默认为 new Date()
   * @param  {[type]} fmt  是否格式化
   * @return {[type]}      返回格式化后的日期内容
   */
  queryDate(data, def = new Date(), fmt = 'YYYY-MM-DD HH:mm:ss') {
    if (data) {
      data = new Date(data);
    }
    if (!data || data === 'Invalid Date') {
      data = def;
    }
    return moment(data).format(fmt);
  },

  /**
   * [passEncrypt 将密码加盐加密]
   * @param  {[type]} id   [description]
   * @param  {[type]} pass [description]
   * @return {[type]}      [description]
   */
  passEncrypt(id, pass) {
    id = id.toString();
    const fi = [ 0, 1, 1, 2, 3, 5, 8, 13, 21 ];
    let salt = '';
    for (const v of fi) {
      salt += id[v];
    }
    const cipher = crypto.createCipher('aes-256-cbc', salt);
    let crypted = cipher.update(pass, 'utf8', 'base64');
    crypted += cipher.final('base64');
    return crypted;

    // const decipher = crypto.createDecipher('aes-256-cbc', salt);
    // let dec = decipher.update(crypted, 'base64', 'utf8');
    // dec += decipher.final('utf8');
  },

  /**
   * [md5 生成md5签名]
   * @param  {[type]} content [被签名数据]
   * @return {[type]}         [返回签名]
   */
  md5(content) {
    if (content) {
      const md5 = crypto.createHash('md5');
      md5.update(content);
      const sign = md5.digest('hex');
      return sign.toUpperCase();
    }
  },

  /**
   * [setSessData 给session中设置与登录等状态无关的缓存数据]
   * @param {[type]} key [键，字符串]
   * @param {[type]} val [值]
   */
  setSessData(key, val) {
    const { session } = this.ctx;
    if (session) {
      if (!session.data) {
        session.data = {};
      }
      session.data[key] = val;
    }
  },

  /**
   * [getSessData 从session.data中获取数据]
   * @param  {[type]} key [键，字符串]
   * @return {[type]}     [返回存储的值]
   */
  getSessData(key) {
    const { session } = this.ctx;
    if (session) {
      if (!session.data) {
        session.data = {};
      }
      return session.data[key];
    }
  },

  /**
   * [codeMsg 错误码与错误信息]
   * @param  {[type]} code [根据错误码获取错误信息]
   * @return {[type]}      [返回对应错误信息 没有错误码则返回通用错误码]
   * 1 01  01            1
   *   模块 模块内业务编号 业务内具体错误编号
   * 00/0 代表通用 如
   *  101001 代表 01 模块内通用的 1 号错误信息
   *  100000 代表适用于所有模块内所有业务所有错误
   *  100404 代表适用于所有模块的通用错误
   */
  codeMsg(code) {
    if (code) {
      return codes[code];
    }
    return 100000; // 通用错误 code
  },

  genUpToken() {
    const config = this.app.config.qiniu;
    const options = {
      scope: config.bucket,
      returnBody: config.returnBody,
    };
    const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    // TODO 做缓存，token 默认是 3600 秒
    return {
      dn: config.mapping[config.bucket].dn,
      token: uploadToken,
    };
  },

  idValid(obj, type, key) {
    if (!obj) {
      return false;
    }
    if (this.isEmpty(obj.id) && this.isEmpty(obj[key])) {
      return false;
    }
    const v = obj.id || obj[key];
    switch (type) {
      case 'merchant':
        if (/^[0-9a-z]{2,16}$/.test(v)) {
          return true;
        }
        return false;
      default:
        return false;
    }
  },

  /**
   * 判断某个值是否为空，判断只涉及 '' null undefined
   * @param  {[type]} v 被判断的值
   * @return {[type]}   为空返回 true，不为空返回 false
   */
  isEmpty(v) {
    if (v === '' || v === null || v === undefined) return true;
    return false;
  },

  /**
   * 生成随机字符串，支持纯字符串，字符串加数字，纯数字
   * @param  {Number} len  要生生的字符串长度
   * @param  {String} type 随机字符串内容类型，str: 含a-zA-Z的纯字母 strnum: 含a-zA-Z0-9的字母加数字 num: 含0-9的数字
   * @return {String}
   */
  randomStr(len = 4, type = 'str') {
    let text = '';
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const num = '0123456789';
    const dictionary = [ str, str + num, num ][
      { str: 0, strnum: 1, num: 2 }[type]
    ];
    for (let i = 0; i <= len; i++) {
      text += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    }
    return text;
  },

  /**
   * 日期操作
   */
  moment,
};
