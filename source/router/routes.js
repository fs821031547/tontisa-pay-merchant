const routes = [
  {
    path: '/',
    name: 'index',
    redirect: { name: 'index_home' },
    component: () => import(/* webpackChunkName: "pages/index" */ '../pages/index'),
    children: [
      {
        path: '/home',
        name: 'index_home',
        label: '首页',
        component: () => import(/* webpackChunkName: "structures/index/home" */ '../structures/index/home'),
      },
      {
        path: '/user',
        name: 'user',
        label: '用户中心',
        component: () => import(/* webpackChunkName: "structures/user/info" */ '../structures/user/info'),
        meta: {
          display: false,
        },
      },
      {
        path: '/merchant',
        name: 'merchant_home',
        label: '商户中心',
        redirect: { name: 'merchant_stats' },
        meta: {
          open: true,
        },
      },
      {
        path: '/merchant/:id',
        name: 'merchant_select',
        label: '选择商户',
        redirect: { name: 'merchant_stats' },
        meta: {
          virtual: true,
          render: 'struct-index-menu-merchant-select',
        },
      },
      {
        path: '/merchant/:id/stats',
        name: 'merchant_stats',
        label: '统计信息',
        component: () => import(/* webpackChunkName: "structures/merchant/stats" */ '../structures/merchant/stats'),
      },
      {
        path: '/merchant/:id/trade',
        name: 'merchant_trade',
        label: '交易记录',
        component: () => import(/* webpackChunkName: "structures/merchant/trade" */ '../structures/merchant/trade'),
      },
      {
        path: '/merchant/:id/info',
        name: 'merchant_info',
        label: '商户资料',
        component: () => import(/* webpackChunkName: "structures/merchant/info" */ '../structures/merchant/info'),
      },
    ],
  },
  {
    path: '/sign',
    name: 'sign',
    component: () => import(/* webpackChunkName: "pages/sign" */ '../pages/sign'),
  },
  {
    path: '/merchant-apply',
    name: 'merchant-apply',
    component: () => import(/* webpackChunkName: "pages/sign" */ '../structures/merchant/merchant-apply'),
  },
];

export default routes;
