import router from '../router';
import routes from '../router/routes';
// 生成菜单数据
const menusPath = {};
const menusName = {};
const menusMap = {};
const menusOpen = [];
routes.forEach(route => {
  if (route.name === 'index') {
    route.children.forEach((child, index) => {
      if (child.redirect && (!child.meta || !child.meta.virtual)) {
        // 代表它是父菜单，将它的path保存，之后遇到以它的path开头的都是它的子菜单
        menusPath[child.path] = {
          path: child.path,
          name: child.name,
          label: child.label,
          child: [],
          meta: child.meta,
          redirect: child.redirect,
        };
        if (child.meta && child.meta.open) {
          menusOpen.push(child.name);
        }
        menusMap[child.path] = menusPath[child.path];
        menusName[child.name] = menusPath[child.path];
      } else {
        const onemenu = {
          path: child.path,
          name: child.name,
          label: child.label,
          meta: child.meta,
          redirect: child.redirect,
        };
        const paths = child.path
          .slice(1)
          .split('/')
          .map((v, i, arr) => {
            if (arr[i - 1]) {
              return '/' + arr[i - 1] + '/' + v;
            } else {
              return '/' + v;
            }
          });
        let childput = false;
        paths.forEach(path => {
          if (menusPath[path]) {
            childput = true;
            menusPath[path].child.push(onemenu);
          }
        });
        if (!childput) {
          menusPath[child.path] = onemenu;
        }
        menusMap[child.path] = onemenu;
        menusName[child.name] = onemenu;
      }
    });
  }
});
const module = {
  state: {
    menusPath: menusPath, // 菜单数据
    menusName: menusName, // 菜单数据 路由name为键
    menusMap: menusMap, // 菜单map数据 没有级别 路由path为键
    menusOpen: menusOpen,
    navs: [ menusPath['/home'] ], // 面包屑导航数据
    tabs: [ '/home' ], // tab 导航数据
  },
  getters: {
  },
  actions: {
    menuJump ({ state, dispatch }, menu) {
      dispatch('routerParams', menu).then(function (params) {
        router.push({ name: menu.name, params });
      });
      dispatch('tabAdd', menu.path);
    },
    tabJump ({ state, dispatch }, path) {
      dispatch('tabAdd', path);
      dispatch('routerParams', state.menusMap[path]).then(function (params) {
        router.push({ name: state.menusMap[path].name, params });
      });
    },
    tabAdd ({ state }, path) {
      if (state.tabs.indexOf(path) < 0) {
        state.tabs.push(path);
      }
    },
    tabClose ({ state, dispatch }, { path, cur }) {
      const i = state.tabs.indexOf(path);
      const newpath = state.tabs[i - 1];
      state.tabs.splice(i, 1);
      if (path === cur || !cur) {
        dispatch('routerParams', state.menusMap[newpath]).then(function (params) {
          router.push({ name: state.menusMap[newpath].name, params });
        });
      }
    },
    navShow ({ state, dispatch }, menu) {
      // 拆分 menu path，从 menu 中取值
      const originMenu = state.menusName[menu.name];
      const paths = originMenu.path
      .slice(1)
      .split('/')
      .map((v, i, arr) => {
        if (i > 0) {
          let returnStr = '';
          for (let j = 0; j < i; j++) {
            returnStr = returnStr + '/' + arr[j];
          }
          return returnStr + '/' + v;
        } else {
          return '/' + v;
        }
      });
      const newNav = [];
      paths.forEach(path => {
        if (state.menusMap[path]) {
          newNav.push(state.menusMap[path]);
        }
      });
      state.navs = newNav;
    },
  },
  mutations: {

  },
};

export default module;
