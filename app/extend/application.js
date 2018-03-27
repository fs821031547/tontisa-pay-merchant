const moment = require('moment');
const util = require('../util.js'); // eslint-disable-line

const API_SERVICE = Symbol('Application#ApiService');
const CUSTOM_CONTROLLER = Symbol('Application#CustomController');

module.exports = {
  get ApiService() {
    if (!this[API_SERVICE]) {
      class ApiService extends this.Service {
        apiFailRes(api, errors) {
          if (!errors || !errors.success) {
            this.ctx.throw(502, `Request Api Data Get Fail Result in ${api}`, {
              code: 'api_fail_res',
              errors,
            });
          }
        }
        sendBefore(method, api, body) {
          if (!body.noPreTreat) {
            body.data.appId = this.config.apiConfig.appId;
            body.data.timestamp = moment(new Date()).format(
              'YYYY-MM-DD HH:mm:ss'
            );

            const data = body.data;
            if (data.sign) delete data.sign;
            // 将数据的键按照字母顺序排序
            const dKeys = Object.keys(data).sort();
            // 生成被签名数据
            const signStrs = [];
            for (const k of dKeys) {
              let v = data[k];
              if (v === '' || v === null || v === undefined) {
                continue;
              }
              if (typeof v === 'object') {
                v = JSON.stringify(data[k]);
              } else {
                v = data[k];
              }
              signStrs.push(`${k}=${v}`);
            }
            const signStr =
              this.config.apiConfig.appSecret +
              signStrs.join('&') +
              this.config.apiConfig.appSecret;
            body['sign-str'] = signStr;
            body.data.sign = this.ctx.helper.md5(signStr);
          }
          this.ctx.app.logger.info(
            'api_req --> ',
            method,
            api,
            JSON.stringify(body)
          );
        }
        sendAfter(method, api, data) {
          if (this.config.env === 'local') {
            this.ctx.app.logger.debug(
              'api_res <-- ',
              method,
              api,
              JSON.stringify(data)
            );
          } else {
            this.ctx.app.logger.info('api_res <-- ', method, api);
          }
          // temp-start 临时处理修改返回数据的数据结构
          if (data.hasOwnProperty('executeStatus')) {
            if (data.executeStatus === '0') {
              data.success = true;
            } else {
              data.success = false;
            }
            delete data.executeStatus;
            if (data.values) {
              data.data = data.values;
              delete data.values;
            }
            if (data.errorCode) {
              data.code = data.errorCode;
              delete data.errorCode;
            }
            if (data.errorMsg) {
              data.message = data.errorMsg;
              delete data.errorMsg;
            }
          }
          // temp-end
        }
        genApiUrl(url) {
          if (url.startsWith('http')) {
            return url;
          }
          let appHost = this.config.apiConfig.appHost;
          // temp-start 这块是临时处理，后面要干掉
          if (url.startsWith('/user')) {
            appHost = 'http://192.168.110.47:8080';
          }
          // temp-end
          return appHost + url;
        }
        async apiPost(api, data = {}, option) {
          const body = {
            method: 'POST',
            contentType: 'form',
            data,
            dataType: 'json',
          };
          if (option) Object.assign(body, option);
          const reqUrl = this.genApiUrl(api, 'POST', body);
          this.sendBefore('POST', reqUrl, body);
          const result = await this.ctx.curl(reqUrl, body);
          this.sendAfter('POST', reqUrl, result.data);
          this.apiFailRes(api, result.data);
          return result;
        }
        async apiPut(api, data = {}, option) {
          const body = {
            method: 'PUT',
            contentType: 'form',
            data,
            dataType: 'json',
          };
          if (option) Object.assign(body, option);
          const reqUrl = this.genApiUrl(api);
          this.sendBefore('PUT', reqUrl, body);
          const result = await this.ctx.curl(reqUrl, body);
          this.sendAfter('PUT', reqUrl, result.data);
          this.apiFailRes(api, result.data);
          return result;
        }
        async apiDelete(api, data = {}, option) {
          const body = {
            method: 'DELETE',
            contentType: 'form',
            data,
            dataType: 'json',
          };
          if (option) Object.assign(body, option);
          const reqUrl = this.genApiUrl(api);
          this.sendBefore('DELETE', reqUrl, body);
          const result = await this.ctx.curl(reqUrl, body);
          this.sendAfter('DELETE', reqUrl, result.data);
          this.apiFailRes(api, result.data);
          return result;
        }
        async apiPatch(api, data = {}, option) {
          const body = {
            method: 'PATCH',
            contentType: 'form',
            data,
            dataType: 'json',
          };
          if (option) Object.assign(body, option);
          const reqUrl = this.genApiUrl(api);
          this.sendBefore('PATCH', reqUrl, body);
          const result = await this.ctx.curl(reqUrl, body);
          this.sendAfter('PATCH', reqUrl, result.data);
          this.apiFailRes(api, result.data);
          return result;
        }
        async apiGet(api, data = {}, option) {
          const body = {
            method: 'GET',
            data,
            dataType: 'json',
          };
          if (option) Object.assign(body, option);
          const reqUrl = this.genApiUrl(api);
          this.sendBefore('GET', reqUrl, body);
          const result = await this.ctx.curl(reqUrl, body);
          this.sendAfter('GET', reqUrl, result.data);
          this.apiFailRes(api, result.data);
          return result;
        }
      }
      this[API_SERVICE] = ApiService;
    }
    return this[API_SERVICE];
  },
  get CustomController() {
    if (!this[CUSTOM_CONTROLLER]) {
      // 自定义 Controller 基类
      // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
      class CustomController extends this.Controller {
        success(data, meta) {
          this.ctx.body = this.ctx.helper.resWrap(
            true,
            data,
            undefined,
            undefined,
            meta
          );
        }
        fail(
          msg = this.ctx.helper.codeMsg(100400),
          code = 100400,
          status = 200,
          errors,
          log
        ) {
          this.ctx.status = status;
          if (typeof msg === 'number') {
            code = msg;
            msg = this.ctx.helper.codeMsg(msg);
          }
          this.ctx.body = this.ctx.helper.resWrap(false, errors, msg, code);
          if (log) {
            // httperror 方式抛出错误
            this.ctx.throw(status, msg);
          }
        }
        notFound(msg, code, status) {
          this.fail(
            msg || this.ctx.helper.codeMsg(100404),
            100404,
            status || 404,
            undefined,
            true
          );
        }
      }
      this[CUSTOM_CONTROLLER] = CustomController;
    }
    return this[CUSTOM_CONTROLLER];
  },
};
