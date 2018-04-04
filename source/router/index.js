import Vue from 'vue';
import Router from 'vue-router';
// import store from '../store';
import routes from './routes';

Vue.use(Router);

const router = new Router({
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.name !== 'sign') {
//     // 验证是否有 MERCHANT_PAY_SESS cookie
//     const cookie = Vue.util.getCookie('MERCHANT_PAY_SESS');
//     if (cookie) {
//       if (!store.state.user.user) {
//         let enter = false;
//         const st = setTimeout(() => {
//           if (!enter) {
//             // 5秒后都没有进入其他页面，则到登录页面
//             next({ name: 'sign' });
//           }
//         }, 5000);
//         // 如果登录，但没有用户信息，请求用户信息
//         store.dispatch('userInfo').then(() => {
//           // 可以进入页面
//           enter = true;
//           clearTimeout(st);
//           next();
//         });
//       } else {
//         next();
//       }
//     } else {
//       // 进到登录页面
//       next({ name: 'sign' });
//     }
//   } else {
//     next();
//   }
// });

export default router;
