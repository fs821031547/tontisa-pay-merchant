/* eslint-disable */
/**
 * Copyright(c) node-modules and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  fengmk2 <fengmk2@gmail.com>
 *  dead_horse <dead_horse@qq.com>
 */

'use strict';

var util = require('util');

// custom extend:
var validator = require('validator')

/**
 * Regexps
 */

var DATE_TYPE_RE = /^\d{4}\-\d{2}\-\d{2}$/;
var DATETIME_TYPE_RE = /^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}(\.\d{3})?$/;
var ID_RE = /^\d+$/;

// http://www.regular-expressions.info/email.html
var EMAIL_RE = /^[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+(?:\.[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/;

var PASSWORD_RE = /^[\w\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\|\;\:\'\"\,\<\.\>\/\?]+$/;

// https://gist.github.com/dperini/729294
var URL_RE = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;

/**
 * Parameter class
 * @class Parameter
 */
class Parameter {
  constructor(opts) {
    opts = opts || {};

    if (typeof opts.translate === 'function') {
      this.translate = opts.translate;
    }
  }

  t() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof this.translate === 'function') {
      return this.translate.apply(this, args);
    } else {
      return util.format.apply(util, args);
    }
  }

  /**
   * validate
   *
   * @param {Object} rules
   * @return {Object} obj
   * @api public
   */
  validate(rules, obj, opt) {
    if (typeof rules !== 'object') {
      throw new TypeError('need object type rule');
    }

    var self = this;

    var errors = [];

    // custom extend: 完整性校验
    // shouldEntire：rule 中没有的字段不能在 obj 中存在
    // allowEmpty: obj 不允许为空对象
    opt = Object.assign({ shouldEntire: true, allowEmpty: false}, opt);
    if (!opt.allowEmpty && ( !obj || Object.keys(obj).length <= 0)) {
      errors.push({
        message: this.t('the object to validate cannot be empty'),
        field: '',
        code: this.t('empty_obj')
      });
      return errors;
    }
    if (opt.shouldEntire) {
      for (var okey in obj) {
        if (!rules.hasOwnProperty(okey)) {
          // 不允许出现 rule 里没有的字段
          errors.push({
            message: this.t('the field: ' + okey + ' is inadmissibility'),
            field: okey,
            code: this.t('disallow_field')
          });
        }
      }
      if (errors.length) {
        return errors;
      }
    }

    for (var key in rules) {
      var rule = formatRule(rules[key]);
      var has = obj.hasOwnProperty(key);

      if (!has) {
        if (rule.required !== false) {
          errors.push({
            message: this.t('required'),
            field: key,
            code: this.t('missing_field')
          });
        }
        continue;
      }

      var checker = TYPE_MAP[rule.type];
      if (!checker) {
        throw new TypeError('rule type must be one of ' + Object.keys(TYPE_MAP).join(', ') +
          ', but the following type was passed: ' + rule.type);
      }

      var msg = checker.call(self, rule, obj[key], obj);
      if (typeof msg === 'string') {
        errors.push({
          message: msg,
          code: this.t('invalid'),
          field: key
        });
      }

      if (Array.isArray(msg)) {
        msg.forEach(function (e) {
          var dot = rule.type === 'object' ? '.' : '';
          e.field = key + dot + e.field;
          errors.push(e);
        });
      }
    }

    if (errors.length) {
      return errors;
    }
  }

  /**
   * add custom rule
   *
   * @param {String} type
   * @param {Function | RegExp} check
   * @api public
   */

  addRule(type, check) {
    if (!type) {
      throw new TypeError('`type` required');
    }

    if (typeof check === 'function') {
      TYPE_MAP[type] = check;
      return;
    }

    if (check instanceof RegExp) {
      TYPE_MAP[type] = function (rule, value) {
        return checkString.call(this, {format: check}, value);
      };
      return;
    }

    throw new TypeError('check must be function or regexp');
  }
};

/**
 * Module exports
 * @type {Function}
 */
module.exports = Parameter;


/**
 * Simple type map
 * @type {Object}
 */
var TYPE_MAP = Parameter.TYPE_MAP = {
  number: checkNumber,
  numberStr: checkNumberStr,
  int: checkInt,
  intStr: checkIntStr,
  integer: checkInt,
  integerStr: checkIntStr,
  string: checkString,
  id: checkId,
  date: checkDate,
  dateTime: checkDateTime,
  boolean: checkBoolean,
  bool: checkBoolean,
  array: checkArray,
  object: checkObject,
  enum: checkEnum,
  email: checkEmail,
  password: checkPassword,
  url: checkUrl,
  mid: checkMID,
  phone: checkPhone,
  domain: checkDomain,
};

/**
 * format a rule
 *
 * @param {Mixed} rule
 * @return {Object}
 * @api private
 */

function formatRule(rule) {
  if (typeof rule === 'string') {
    return { type: rule };
  }
  if (Array.isArray(rule)) {
    return { type: 'enum', values: rule };
  }
  if (rule instanceof RegExp) {
    return { type: 'string', format: rule };
  }
  return rule || {};
}

/**
 * check interger
 * {
 *   max: 100,
 *   min: 0
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkInt(rule, value) {
  if (typeof value !== 'number' || value % 1 !== 0) {
    return this.t('should be an integer');
  }

  var allowEmpty = rule.hasOwnProperty('allowEmpty')
    ? rule.allowEmpty
    : rule.empty;

  if (value === '' || value === null || value === undefined) {
    if (allowEmpty) {
      return
    } else {
      return this.t('should not be empty');
    }
  }
  if (rule.hasOwnProperty('max') && value > rule.max) {
    return this.t('should smaller than %s', rule.max);
  }

  if (rule.hasOwnProperty('min') && value < rule.min) {
    return this.t('should bigger than %s', rule.min);
  }
}

/**
 * check string interger
 * {
 *   max: 100,
 *   min: 0
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkIntStr(rule, value) {
  if (isNaN(value)) {
    return this.t('should be an integer');
  } else {
    return checkInt.call(this, rule, Number(value));
  }
}

/**
 * check number
 * {
 *   max: 100,
 *   min: 0
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkNumber(rule, value) {
  if (typeof value !== 'number') {
    return this.t('should be a number');
  }
  var allowEmpty = rule.hasOwnProperty('allowEmpty')
    ? rule.allowEmpty
    : rule.empty;

  if (value === '' || value === null || value === undefined) {
    if (allowEmpty) {
      return
    } else {
      return this.t('should not be empty');
    }
  }
  if (rule.hasOwnProperty('max') && value > rule.max) {
    return this.t('should smaller than %s', rule.max);
  }
  if (rule.hasOwnProperty('min') && value < rule.min) {
    return this.t('should bigger than %s', rule.min);
  }
}

/**
 * check string number
 * {
 *   max: 100,
 *   min: 0
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkNumberStr(rule, value) {
  if (isNaN(value)) {
    return this.t('should be a number');
  } else {
    return checkNumber.call(this, rule, Number(value));
  }
}

/**
 * check string
 * {
 *   allowEmpty: true, // (default to false, alias to empty)
 *   format: /^\d+$/,
 *   max: 100,
 *   min: 0
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkString(rule, value) {
  if (typeof value !== 'string') {
    return this.t('should be a string');
  }
  var allowEmpty = rule.hasOwnProperty('allowEmpty')
    ? rule.allowEmpty
    : rule.empty;

  if (value === '' || value === null || value === undefined) {
    if (allowEmpty) {
      return
    } else {
      return this.t('should not be empty');
    }
  }
  if (rule.hasOwnProperty('max') && value.length > rule.max) {
    return this.t('length should smaller than %s', rule.max);
  }
  if (rule.hasOwnProperty('min') && value.length < rule.min) {
    return this.t('length should bigger than %s', rule.min);
  }

  if (rule.format && !rule.format.test(value)) {
    return rule.message || this.t('should match %s', rule.format);
  }
}

/**
 * check id format
 * format: /^\d+/
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkId(rule, value) {
  return checkString.call(this, {format: ID_RE}, value);
}

/**
 * check date format
 * format: YYYY-MM-DD
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkDate(rule, value) {
  var dateRule = Object.assign({ format: DATE_TYPE_RE }, rule);
  return checkString.call(this, dateRule, value);
}

/**
 * check date time format
 * format: YYYY-MM-DD HH:mm:ss
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkDateTime(rule, value) {
  var dateRule = Object.assign({ format: DATETIME_TYPE_RE }, rule);
  return checkString.call(this, dateRule, value);
}

/**
 * check boolean
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkBoolean(rule, value) {
  var allowEmpty = rule.hasOwnProperty('allowEmpty')
    ? rule.allowEmpty
    : rule.empty;

  if (value === '' || value === null || value === undefined) {
    if (allowEmpty) {
      return
    } else {
      return this.t('should not be empty');
    }
  }
  if (typeof value !== 'boolean') {
    return this.t('should be a boolean');
  }
}

/**
 * check enum
 * {
 *   values: [0, 1, 2]
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkEnum(rule, value) {
  if (!Array.isArray(rule.values)) {
    throw new TypeError('check enum need array type values');
  }
  var allowEmpty = rule.hasOwnProperty('allowEmpty')
    ? rule.allowEmpty
    : rule.empty;

  if (value === '' || value === null || value === undefined) {
    if (allowEmpty) {
      return
    } else {
      return this.t('should not be empty');
    }
  }
  if (rule.values.indexOf(value) === -1) {
    return this.t('should be one of %s', rule.values.join(', '));
  }
}

/**
 * check email
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkEmail(rule, value) {
  // custom extend
  var emailRule = {
    format: EMAIL_RE,
    message: rule.message || this.t('should be an email')
  };
  Object.assign(emailRule, rule);
  return checkString.call(this, emailRule, value);
}

/**
 * check password
 * @param {Object} rule
 * @param {Object} value
 * @param {Object} obj
 * @return {Boolean}
 *
 * @api private
 */

function checkPassword(rule, value, obj) {
  if (!rule.min) {
    rule.min = 6;
  }
  rule.format = PASSWORD_RE;
  var error = checkString.call(this, rule, value);
  if (error) {
    return error;
  }
  if (rule.compare && obj[rule.compare] !== value) {
    return this.t('should equal to %s', rule.compare);
  }
}

/**
 * check url
 *
 * @param {Object} rule
 * @param {Object} value
 * @return {Boolean}
 * @api private
 */

function checkUrl(rule, value) {
  // custom extend
  var urlRule = {
    format: URL_RE,
    message: rule.message || this.t('should be a url')
  };
  Object.assign(urlRule, rule);
  return checkString.call(this, urlRule, value);
}

/**
 * check object
 * {
 *   rule: {}
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkObject(rule, value) {
  if (typeof value !== 'object') {
    return this.t('should be an object');
  }

  if (rule.rule) {
    return this.validate(rule.rule, value);
  }
}

/**
 * check array
 * {
 *   type: 'array',
 *   itemType: 'string'
 *   rule: {type: 'string', allowEmpty: true}
 * }
 *
 * {
 *   type: 'array'.
 *   itemType: 'object',
 *   rule: {
 *     name: 'string'
 *   }
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkArray(rule, value) {
  var allowEmpty = rule.hasOwnProperty('allowEmpty')
    ? rule.allowEmpty
    : rule.empty;

  if (value === '' || value === null || value === undefined) {
    if (allowEmpty) {
      return
    } else {
      return this.t('should not be empty');
    }
  }
  if (!Array.isArray(value)) {
    return this.t('should be an array');
  }

  if (!rule.itemType) {
    return;
  }

  var self = this;
  var checker = TYPE_MAP[rule.itemType];
  if (!checker) {
    throw new TypeError('rule type must be one of ' + Object.keys(TYPE_MAP).join(', ') +
        ', but the following type was passed: ' + rule.itemType);
  }

  var errors = [];
  var subRule = rule.itemType === 'object'
  ? rule
  : rule.rule || formatRule.call(self, rule.itemType);

  value.forEach(function (v, i) {
    var index = '[' + i + ']';
    var errs = checker.call(self, subRule, v);

    if (typeof errs === 'string') {
      errors.push({
        field: index,
        message: errs,
        code: self.t('invalid')
      });
    }
    if (Array.isArray(errs)) {
      errors = errors.concat(errs.map(function (e) {
        e.field = index + '.' + e.field;
        e.message = e.message;
        return e;
      }));
    }
  });

  return errors;
}

// custom extend: 添加 mid 校验规则，适用 mongodb 的 id 校验
function checkMID(rule, value) {
  var checkRes = checkString.call(this, rule, value);
  if (checkRes) return checkRes;
  var allowEmpty = rule.hasOwnProperty('allowEmpty')
    ? rule.allowEmpty
    : rule.empty;
  if (!allowEmpty) {
    if (!validator.isMongoId(value)) {
      return 'should be an id';
    }
  }
}

// custom extend: 添加 phone 校验规则，校验 zh-CN 手机
function checkPhone(rule, value) {
  var checkRes = checkString.call(this, rule, value);
  if (checkRes) return checkRes;
  var allowEmpty = rule.hasOwnProperty('allowEmpty')
    ? rule.allowEmpty
    : rule.empty;
  if (!allowEmpty) {
    if (!validator.isMobilePhone(value, 'zh-CN')) {
      return 'should be a phone';
    }
  }
}

// custom extend: 添加 domain 校验规则，校验域名
function checkDomain(rule, value) {
  var checkRes = checkString.call(this, rule, value);
  if (checkRes) return checkRes;
  var allowEmpty = rule.hasOwnProperty('allowEmpty')
    ? rule.allowEmpty
    : rule.empty;
  if (!allowEmpty) {
    if (!validator.isFQDN(value)) {
      return 'should be a domain';
    }
  }
}
