import Vue from 'vue';
import Router from 'vue-router';

import { UserManageComponent } from '@/components/system-manage/user-manage/user-manage';
import { LoginComponent } from '@/components/login';
import { ErrorComponent } from '@/components/error';

import { PmsComponentManager } from '@/components/component-manager/component-manager';

import RouterElement from '@/models/router-element/router-element';
import Component from 'vue-class-component';
Component.registerHooks(['beforeRouteEnter', 'beforeRouteUpdate', 'beforeRouteLeave']);

// export const constantRouterMap = [
//   {
//     path: '/login',
//     name: 'login',
//     component: LoginComponent,
//     hidden: true,
//   },
//   {
//     path: '/404',
//     name: '404',
//     component: ErrorComponent,
//     hidden: true,
//   },
//   {
//     path: '*',
//     hidden: true,
//     name: 'error',
//     redirect: { path: '/404' },
//   },
//   {
//     path: '/',
//     component: LayoutComponent,
//     name: 'plan_brain',
//     hidden: false,
//     iconCls: '',
//     children: [
//       {
//         path: '',
//         redirect: 'plan-template-mgr',
//       },
//       {
//         path: 'data-define',
//         component: BaseDataDefineComponent,
//         name: 'base_data_define',
//         redirect: '/data-define/event-type',
//         hidden: false,
//         iconCls: '',
//         children: [
//           {
//             path: 'rule-type',
//             component: RuleTypeComponent,
//             name: 'rule-type',
//             hidden: false,
//           }
//         ]
//       },
//       {
//         path: 'plan-template-mgr',
//         component: TemplateManageComponent,
//         name: 'plan_template_management',
//         hidden: false,
//         iconCls: '',

//         children: [{
//           path: 'template-list',
//           component: TemplateListComponent,
//           name: 'template_list',
//           hidden: false,
//         }, {
//           path: 'guide',
//           component: TemlateGuidePageComponent,
//           name: 'new_template_guide',
//           hidden: false,
//         }, {
//           path: 'guide-template-detail',
//           component: GuideTemplateEditComponent,
//           name: 'guide_template_detail',
//           hidden: false,
//         }]
//       },
//       {
//         path: '/attribute-manage',
//         component: AttributeManageComponent,
//         name: 'attribute_manage',
//         hidden: false,
//         children: []
//       },
//       {
//         path: '/component-library',
//         component: ComponentLibraryComponent,
//         name: 'component_library',
//         hidden: false,
//         iconCls: '',
//         children: [
//           {
//             path: '/component-preview',
//             component: ComponentPreviewComponent,
//             name: 'component_preview',
//             hidden: false,
//             iconCls: ''
//           }
//         ]
//       },
//       {
//         path: '/rule-library',
//         component: RuleLibraryComponent,
//         name: 'rule_library',
//         hidden: false,
//         iconCls: '',
//       }
//     ]
//   },
//   {
//     path: '/system-manage',
//     component: LayoutComponent,
//     name: 'system_manage',
//     hidden: false,
//     iconCls: '',
//     children: [
//       {
//         path: '/role-manage',
//         name: 'role_manage',
//         component: RoleManageComponent,
//         hidden: false,
//       },
//       {
//         path: '/user-manage',
//         name: 'user_manage',
//         component: UserManageComponent,
//         hidden: false,
//       },
//       {
//         path: '/resource-manage',
//         name: 'resource_manage',
//         component: ResourceManageComponent,
//         hidden: false,
//       }
//     ]
//   },
//   {
//     path: '/',
//     component: LayoutComponent,
//     name: 'plan_deduction',
//     hidden: false,
//     iconCls: '',
//     children: [
//       {
//         path: '/create-deduction',
//         component: CreateDeductionComponent,
//         name: 'create_deduction',
//         hidden: false,
//         iconCls: ''
//       },
//       {
//         path: '/create-situaction',
//         component: CreateSituationComponent,
//         name: 'create_situation',
//         hidden: false,
//         iconCls: ''
//       },
//       {
//         path: '/planning-deduction',
//         component: PlanningDeductionComponent,
//         name: 'planning_deduction',
//         hidden: false,
//         iconCls: ''
//       }
//     ]
//   }
// ];

const routerMap: any = [];
const routerLogin = new RouterElement();
const routerError = new RouterElement();
const routerAnyError = new RouterElement();
const routerComponentMgr = new RouterElement();
/**
 * login
 */
routerLogin.path = '/login';
routerLogin.name = 'login';
routerLogin.component = LoginComponent;
routerLogin.hidden = true;
routerMap.push(routerLogin);

/**
 * error
 */
routerError.path = '/404';
routerError.name = '';
routerError.component = ErrorComponent;
routerError.hidden = true;
routerMap.push(routerError);

/**
 *  *
 */
routerAnyError.path = '/error';
routerAnyError.name = 'error';
routerAnyError.component = ErrorComponent;
routerAnyError.hidden = true;
routerMap.push(routerAnyError);


routerComponentMgr.path = '/component-manager';
routerComponentMgr.name = 'component-manager';
routerComponentMgr.component = PmsComponentManager;
routerComponentMgr.hidden = true;
routerMap.push(routerComponentMgr);


export let constRouterMap = routerMap;

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location: any) {
  return Promise.resolve(originalPush.call(this, location)).catch((err: any) => err);
};

Vue.use(Router);

// 根据运行环境设置路由mode的值，防止刷新页面出现404
// let modeValue: any;
// if (process.env.NODE_ENV === 'production') {
//   // 为生产环境修改配置...
//   modeValue = 'hash';
// } else {
//   // 为开发环境修改配置...
//   modeValue = 'hash';
// }

const modeValue = 'hash';

export default new Router({
  mode: modeValue,
  base: process.env.BASE_URL,
  routes: routerMap
  // routes: constantRouterMap,
});
