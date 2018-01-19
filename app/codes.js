module.exports = {
  400: 'Bad Request',
  404: 'Not Found',
  401: 'Unauthorized',
  100400: 'bad request',
  100401: 'the credential is required',
  100404: 'not found',
  100502: 'backEnd result fail',

  // 101xxx user controller
  101011: 'user verify data is incomplete', // 没有用户验证数据不完整
  101012: 'no user data', // 无法获取用户数据
  101013: 'user password verify failed', // 用户密码验证失败
  101014: 'user phone code verify failed', // 用户手机验证码验证失败
  101015: 'user account is required', // 需要用户账号，手机号或邮箱
  101021: 'old password is required to modify password', // 修改密码时需要旧密码
  101022: 'old password verification failed', // 旧密码验证失败
  101023: 'phone verify code is required to modify password', // 修改密码时需要验证码
  101024: 'phone verify code verification failed', // 短信验证码验证失败
  101031: 'email verify code verification failed', // 邮箱验证码验证失败
  101041: 'phone verify code verification failed', // 短信验证码验证失败
  101042: 'no user data', // 无法获取用户数据

  // 102xxx verify controller
  102011: 'phone verify code verification failed', // 短信验证码验证失败
};
