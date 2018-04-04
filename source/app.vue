<template>
  <router-view></router-view>
</template>

<script>
import sign from './structures/sign/in';
export default {
  name: 'app',
  data () {
    return {
      codes: {
        101012: '用户未注册！', // 无法获取用户数据
        101013: '用户名或密码验证失败！', // 用户密码验证失败
        101014: '短信验证码验证失败', // 用户手机验证码验证失败
      },
    };
  },
  methods: {
    globalAuth () {
      const vm = this;
      this.$msgbox({
        customClass: 'auth-message-block',
        message: this.$createElement(sign, {
          on: {
            signed () {
              vm.$msgbox.close();
            },
          },
        }),
        showConfirmButton: false,
        closeOnClickModal: false,
        closeOnHashChange: false,
        closeOnPressEscape: false,
      });
    },
    globalMessage (type) {
      const vm = this;
      return function (response) {
        const msg = {
          message: '未知问题',
          showClose: true,
        };
        if (response && response.data && response.data.meta && response.data.meta.code) {
          const code = response.data.meta.code;
          if (vm.codes[code]) {
            msg.message = vm.codes[code];
          } else {
            console.warn('code for message: ', response.data);
          }
        }
        if (type) {
          msg.type = type;
        }
        vm.$message(msg);
      };
    },
  },
  created () {
    const CancelToken = this.$http.CancelToken;
    const source = CancelToken.source();
    const globalAuth = this.globalAuth;
    const globalWarning = this.globalMessage('warning');
    const allowUrl = [ '/api/user/sign', '/api/user/signout',
      '/api/verify/phone/send', '/api/user/notexist', '/api/user/signup', '/api/verify/phone/code' ];
    this.$http.interceptors.request.use(
    config => {
      if (!this.$util.getCookie('MERCHANT_PAY_SESS')) {
        if (allowUrl.indexOf(config.url) < 0) {
          // 不是进行登录或注销，则不带cookie不能进行请求
          // 弹出登录框进行登录
          globalAuth();
          source.cancel('Request Canceled Because No Correct Credential');
        }
      }
      config.cancelToken = source.token;
      return config;
    },
    err => {
      console.log('App Request Occur Error: ', err);
      return Promise.reject(err);
    });
    this.$http.interceptors.response.use(
    response => {
      const data = response.data;
      if (data && (data.meta.code === 401 || data.meta.code === 100401)) {
        // 弹出登录框
        if (allowUrl.indexOf(response.config.url) < 0) {
          globalAuth();
        }
      }
      if (response.config.noglobalmsg !== true) {
        if (data && !data.meta.success) {
          globalWarning(response);
          const err = {
            response,
          };
          throw err;
        }
      }
      return response;
    },
    err => {
      if (err && err.response && err.response.staus === 401) {
        // 弹出登录框
        if (allowUrl.indexOf(err.config.url) < 0) {
          globalAuth();
        }
      } else {
        console.log('Network Error');
      }
      console.log('App Response Occur Error: ', err);
      return Promise.reject(err);
    });
  },
};
// 超时重新请求的全局功能
// 在main.js设置全局的请求次数，请求的间隙
// axios.defaults.retry = 4;
// axios.defaults.retryDelay = 1000;

// axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
//     var config = err.config;
//     // If config does not exist or the retry option is not set, reject
//     if(!config || !config.retry) return Promise.reject(err);

//     // Set the variable for keeping track of the retry count
//     config.__retryCount = config.__retryCount || 0;

//     // Check if we've maxed out the total number of retries
//     if(config.__retryCount >= config.retry) {
//         // Reject with the error
//         return Promise.reject(err);
//     }

//     // Increase the retry count
//     config.__retryCount += 1;

//     // Create new promise to handle exponential backoff
//     var backoff = new Promise(function(resolve) {
//         setTimeout(function() {
//             resolve();
//         }, config.retryDelay || 1);
//     });

//     // Return the promise in which recalls axios to retry the request
//     return backoff.then(function() {
//         return axios(config);
//     });
// });
</script>

<style lang="stylus">
html, body
  height 100%
  margin 0
  font-family 'PingFang SC', 'Source Han Sans', 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
input, textarea, select, button
  font-family 'PingFang SC', 'Source Han Sans', 'Avenir', Helvetica, Arial, sans-serif
.auth-message-block.el-message-box
    padding 0
    width 360px
    .el-message-box__content
      padding 0
    .el-message-box__btns
      padding 0
</style>
