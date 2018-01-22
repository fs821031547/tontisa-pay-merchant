import Vue from 'vue';

const filters = {
  moneyFmt (value) {
    if (value !== null && value !== undefined) {
      let num = Number(value);
      if (isNaN(num)) return value;
      // 转换成 万，亿为单位
      const wan = 10000;
      const yi = 100000000;
      let suffix = '';
      if (num > wan && num < yi) {
        num = num / wan;
        suffix = '万';
      } else if (num > yi) {
        num = num / yi;
        suffix = '亿';
      }
      // 保留两位小数
      let numStr = num.toFixed(2);
      if (numStr.indexOf('.') < 0) {
        numStr = numStr + '.00';
      }
      numStr = numStr + suffix;
      return numStr;
    }
    return value;
  },
};

Vue.filter('moneyFmt', filters.moneyFmt);

Vue.prototype.$filter = filters;

export default filters;
