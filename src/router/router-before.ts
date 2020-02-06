
import router from './index';
import SessionStorage from '@/utils/session-storage';
import RouterElement from '@/models/router-element/router-element';
import GenerateTree from '@/utils/generate-tree';
import { constRouterMap } from '@/router/index';
import store from '@/store/index';
import NProgress from 'nprogress';
import eventNames from '@/common/events/store-events';

export default {
  routerBefore(to: any, from: any, next: any, routerElementArr: any) {
    NProgress.start();
    const token = SessionStorage.get('Admin-Token');
    if (!token && to.path !== '/login') {
      next({ path: 'login' });
    }
    if (token && to.path === '/login') {
      SessionStorage.remove('Admin-Token');
    }
    const permissions = SessionStorage.get('privilegeChilds');
    if (token && Array.isArray(permissions) && permissions.length > 0 && routerElementArr.length === 0) {
      permissions.forEach(p => {
        if (router.options.routes.filter((r: any) => r.path === p.expression).length === 0 && p.description !== '1') {
          const routerElement = new RouterElement();
          routerElement.id = p.id;
          routerElement.pid = p.parentId;
          routerElement.name = p.name;
          routerElement.path = p.expression;
          routerElement.iconCls = p.icon;
          routerElement.component = () =>
            import('@/components/' + p.description).then((result: any) => {
              for (const pro in result) {
                if (pro !== null) {
                  return result[pro];
                }
              }
            });
          routerElement.children = [];
          routerElementArr.push(routerElement);
        }
      });
      if (routerElementArr.length > 0) {
        const routerTree = GenerateTree.generateTree(routerElementArr, '');
        const newRoutes = constRouterMap.concat(routerTree);
        store.commit('SET_ROUTERARR', newRoutes);
        router.addRoutes(routerTree);
        router.options.routes = newRoutes;
        next({ path: to.path });
      }
    }
    next();
    store.dispatch(eventNames.systemSet.SystemSetData);
  }
};
