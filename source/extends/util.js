import Vue from 'vue';

Date.prototype.format = function (fmt) { // eslint-disable-line
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
};

const util = {
  getCookie (name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  },
  resJudge (res) {
    if (res && res.data && res.data.meta &&
      res.data.meta.success && res.data.data) {
      return true;
    }
    return false;
  },
  extentDate (type = 'last', beginDate) {
    const extent = {
      today: { start: 0, end: 0 },
      last: { start: 86400000, end: 86400000 },
      seven: { start: 518400000, end: 0 },
      thirty: { start: 2505600000, end: 0 },
    };
    const beginTime = beginDate ? new Date(beginDate).getTime() : Date.now();
    const startDate = new Date(beginTime - extent[type].start);
    const endDate = new Date(beginTime - extent[type].end);
    const start = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      0, 0, 0
    ).format('yyyy-MM-dd hh:mm:ss');
    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      23, 59, 59
    ).format('yyyy-MM-dd hh:mm:ss');
    return {
      start,
      end,
    };
  },
  dateRange (start, end) {
    if (start && end) {
      start = new Date(start);
      end = new Date(end);
      if (start !== 'Invalid Date' && end !== 'Invalid Date') {
        if (start.getFullYear() === end.getFullYear()) {
          if (start.getMonth() === end.getMonth()) {
            if (start.getDate() === end.getDate()) {
              return 'D';
            }
            return 'M';
          }
          return 'Y';
        }
      }
    }
  },
};

const plugin = {
  install (_Vue, options) {
    if (!_Vue.prototype.$util) _Vue.prototype.$util = {};
    Object.assign(_Vue.prototype.$util, util);
  },
};

Vue.use(plugin);
if (!Vue.util) Vue.util = {};
Object.assign(Vue.util, util);

export default util;
