import userService from '../../components/login/login.service';
import roleManageService from '@/api/role-manage/role-manage.service';
import LocalStorage from '@/utils/local-storage';
import userManageService from '@/api/user-manage/user-manage.service';
import SessionStorage from '@/utils/session-storage';

const user = {
  state: {
    auth: {
      token: SessionStorage.get('Admin-Token')
    },
    userInfo: {
      username: '',
      password: '',
      roles: []
    },
    routerArr: null,
    privileges: null,
    userDetail: {
      username: '',
      name: '',
      description: '',
      email: '',
      image: '',
      phone: ''
    }
  },

  mutations: {
    SET_TOKEN: (state: any, token: any) => {
      state.auth.token = token;
    },
    SET_USER_INFO: (state: any, userInfo: any) => {
      state.userInfo = userInfo;
    },
    SET_ROUTERARR: (state: any, routerArr: any) => {
      state.routerArr = routerArr;
    },
    SET_PRIVILEGES: (state: any, privileges: any) => {
      state.privileges = privileges;
    },
    SET_USER_DETAIL: (state: any, userInfo: any) => {
      state.userDetail.username = userInfo.userName;
      state.userDetail.name = userInfo.name;
      state.userDetail.description = userInfo.description;
      state.userDetail.email = userInfo.email;
      state.userDetail.image = userInfo.image;
      state.userDetail.phone = userInfo.phone;
    }
  },

  actions: {
    // 登录
    async SetToken({ commit }: any, data: any) {
      // const username = userInfo.username.trim();
      // const data: any = await userService.postLoginVali(username, userInfo.password);
      SessionStorage.set('Admin-Token', data.access_token);
      commit('SET_TOKEN', data.access_token);
      return data;
    },

    // over 获取用户信息
    async GetInfo({ commit }: any) {
      const response: any = await userService.getUserInfo();
      const data = response.data;
      commit('SET_USER_INFO', data);
      return response;
    },

    // 获取用户信息
    async GetUserInfo({ commit }: any, userName: any) {
      const data: any = await userManageService.queryUserInfoByUserName(userName);
      commit('SET_USER_DETAIL', data);
    },

    // 登出
    async LogOut({ commit, state }: any) {
      await userService.postLogout();
      commit('SET_TOKEN', '');
      commit('SET_USER_INFO', {});
      SessionStorage.remove('Admin-Token');
    },

    // 权限路由信息
    setRouterArr({ commit }: any, routerArr: any) {
      commit('SET_ROUTERARR', routerArr);
    },

    // 当前角色 权限信息
    setPrivileges({ commit }: any, privileges: any) {
      commit('SET_PRIVILEGES', LocalStorage.get('privilegeChilds'));
    }
  },
  getters: {
    user_auth_token: (state: any) => state.auth.token,
    routerarr: (state: any) => state.routerArr,
    privileges: (state: any) => state.privileges,
    userInfo: (state: any) => state.userInfo,
    userDetail: (state: any) => state.userDetail
  },
};

export default user;
