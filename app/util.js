module.exports = {
  mix(origin, ...mixins) {
    // reference: http://blog.herobs.cn/es6-in-depth-subclassing/
    function copyProperties(target, source) {
      // Reflect 反射，用于获取对象的一些元数据，方法与代理处理程序的方法相同
      // Proxy 将对某对象的操作代理到其他对象中对应的操作上
      for (const key of Reflect.ownKeys(source)) {
        if (key !== 'constructor'
            && key !== 'prototype'
            && key !== 'name') {
          const desc = Object.getOwnPropertyDescriptor(source, key);
          Object.defineProperty(target, key, desc);
        }
      }
    }
    let Mix;
    if (origin) {
      Mix = class extends origin {};
    } else {
      Mix = class {};
    }
    // programmatically add all the methods and accessors of the mixins to class Mix.
    for (const mixin of mixins) {
      copyProperties(Mix, mixin);
      copyProperties(Mix.prototype, mixin.prototype);
    }
    return Mix;
  },
};
