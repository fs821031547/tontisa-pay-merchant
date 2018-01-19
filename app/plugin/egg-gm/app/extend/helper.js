const path = require('path');
function randomCode(length, charset) {
  charset = charset || '23456789abcdefghkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  const charsLen = charset.length;
  const maxByte = 256 - (256 % charsLen);
  let string = '';
  while (length > 0) {
    string += charset.charAt(Math.floor(Math.random() * maxByte) % charsLen);
    length--;
  }
  return string;
}

module.exports = {
  drawFile(dir) {
    const captcha = this.app.captcha;
    const filename = randomCode(6, '23456789abcdefghkmnpqrstuvwxyz') + new Date().getTime();
    let file = filename + '.png';
    if (dir) {
      file = dir + file;
    } else {
      file = '/app/public/assets/captchas/' + file;
    }
    return new Promise((resolve, reject) => {
      // 生成图片有问题有可能是要重启或 delegates 没有支持
      captcha.toFile(path.join(process.cwd(), file)).then(text => {
        resolve({
          text,
          img: file,
        });
      }).catch(err => {
        reject(err);
      });
    });
  },
  drawBuffer() {
    const captcha = this.app.captcha;
    return new Promise((resolve, reject) => {
      captcha.toBuffer().then(({ buffer, text }) => {
        resolve({
          text,
          // img: 'data:image/png;base64,' + buffer.toString('base64'),
          img: buffer,
        });
      }).catch(err => {
        reject(err);
      });
    });
  },
};
