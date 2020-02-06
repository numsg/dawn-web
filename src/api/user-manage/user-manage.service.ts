import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import User from '@/models/user-manage/user';
import { roleManageUrl } from '@/common/url/role-manage-url';
import userManageUrl from '@/common/url/user-manage-url';
import { stringFormat } from '@gsafety/cad-gutil/dist/stringformat';
import axios, { AxiosResponse } from 'axios';

export default {


  /**
   * 添加用户
   * @param {User} user
   */
  addUserInfo(userInfo: User) {
    const url = store.getters.configs.uapUrl + userManageUrl.addUser;
    const token = store.getters.configs.superToken;
    return httpClient.postPromise(url, userInfo, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(async (response: any) => {
      if (response) {
        await this.relateToClientSystem(userInfo.userName, [store.getters.configs.clientId]);
        return response;
      }
    });
  },

  /**
   * 查询非管理员用户
   */
  queryUsers() {
    const url = store.getters.configs.uapUrl + userManageUrl.queryNotClientManager;
    const token = store.getters.configs.superToken;
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },


  /**
   * 根据用户名查询用户信息 manager
   * @param {String} userName 用户名
   */
  queryUserInfoByUserName(userName: string) {
    const url = store.getters.configs.uapUrl
      + stringFormat(userManageUrl.queryUserInfoByUname, store.getters.configs.clientId, String(userName));
    // const url = store.getters.configs.uapUrl
    //   + stringFormat(userManageUrl.queryUserInfoByUname, String(userName));
    const token = store.getters.configs.superToken;
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  /**
   * 根据用户名查询用户信息 personal
   * @param user
   */
  personalQueryUserInfo(userName: string) {
    const url = store.getters.configs.uapUrl
      + stringFormat(userManageUrl.queryUserInfoByUnamePer, store.getters.configs.clientId);
    const token = store.getters.configs.superToken;
    // const token = store.getters.user_auth_token;
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },


  /**
 * 根据用户名查询用户信息 personal
 * @param user
 */
  loginPersonalQueryUserInfo(userName: string) {
    const url = store.getters.configs.uapUrl
      + stringFormat(userManageUrl.queryUserInfoByUnamePer, store.getters.configs.clientId);
    // const token = store.getters.configs.superToken;
    const token = store.getters.user_auth_token;
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  /**
   * 修改用户信息
   * @param {User} user
   */
  updateUserInfo(user: User) {
    const url = store.getters.configs.uapUrl
      + stringFormat(userManageUrl.updateOrDeleteUser, String(user.userName));
    const token = store.getters.configs.superToken;
    const tmpUser: User = Object.assign({}, user);
    delete tmpUser.userName;
    return httpClient.putPromise(url, tmpUser, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  /**
   * 删除用户
   * @param {String} userName 用户名
   */
  deleteUser(userName: string) {
    const url = store.getters.configs.uapUrl
      + stringFormat(userManageUrl.updateOrDeleteUser, String(userName));
    const token = store.getters.configs.superToken;
    return axios.delete(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(this.odataResult);
  },

  odataResult(response: AxiosResponse) {
      if (response.status === 200) {
        return true;
      }
      return false;
  },

  /**
   * 为用户批量关联业务系统
   * @param {String} username
   * @param {String[]} clients
   */
  relateToClientSystem(userName: string, clients: string[]) {
    const url = store.getters.configs.uapUrl
      + stringFormat(userManageUrl.relateToSystem, String(userName));
    const token = store.getters.configs.superToken;
    return httpClient.postPromise(url, clients, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  /**
   * 为用户配置业务系统角色
   * @param {String} clientId
   * @param {String} userName
   */
  addRolesForUser(userName: string, roleCodes: string[]) {
    const url = store.getters.configs.uapUrl
      + stringFormat(userManageUrl.addRolesForUser, store.getters.configs.clientId, String(userName));
    const token = store.getters.configs.superToken;
    return httpClient.putPromise(url, roleCodes, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  /**
   * 重置用户密码
   * @param {String} userName 用户名
   */
  resetPassword(userName: string) {
    const url = store.getters.configs.uapUrl + stringFormat(userManageUrl.resetPassword, String(userName));
    const token = store.getters.configs.superToken;
    return axios.put(url, null, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(this.odataResult);
  },


  /**
   * 根据用户名查询用户信息
   *
   * @param {string} username
   * @returns {Promise<any>}
   */
  usernameQueryInfo(username: string): Promise<any> {
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.roleManageUrl, store.getters.configs.clientId) + '/users/' + username + '/info';
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  /**
   * 用户关联角色信息
   *
   * @param {Array<string>} userNames
   * @param {Array<string>} roleCodes
   * @returns {Promise<any>}
   */
  userRelaseRole(userNames: Array<string>, roleCodes: Array<string>): Promise<any> {
    const params = { userNames: userNames, roleCodes: roleCodes };
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl + stringFormat(roleManageUrl.roleManageUrl, store.getters.configs.clientId)
      + '/users/role';
    return httpClient.putPromise(url, params, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },



  /**
   * 分页查询用户
   *
   * @param {*} param
   * @returns {Promise<any>}
   */
  pageQueryUsers(param: any): Promise<any> {
    const url = store.getters.configs.uapUrl + stringFormat(userManageUrl.clientUsers, store.getters.configs.clientId);
    const token = store.getters.configs.superToken;
    return httpClient.postPromise(url, param, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  // 查询所有用户
  queryAllUsers(): Promise<any> {
    const url = store.getters.configs.uapUrl + userManageUrl.addUser;
    const token = store.getters.configs.superToken;
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer' + token
      }
    });
  },


  /**
   *用户修改自己密码
   *
   * @param {*} param
   * @returns {Promise<any>}
   */
  changePassWord(password: any): Promise<any> {
    const url = store.getters.configs.uapUrl + userManageUrl.changePassword;
    const token = store.getters.user_auth_token;
    return httpClient.putPromise(url, password, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  // 用户退出
  userLogout(): Promise<any> {
    const token = store.getters.user_auth_token;
    // const url = store.getters.configs.uapUrl + userManageUrl.logoutUser + '?access_token=' + token;
    // return httpClient.getPromise(url);
    const url = store.getters.configs.uapUrl + userManageUrl.logoutUser;
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  // 超级管理员强制退出用户
  superLogoutUser(userName: string): Promise<any> {
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl + stringFormat(userManageUrl.forcedLogoutUser, userName);
    return httpClient.putPromise(url, {
      headers: {
        'content-typee': 'application/json',
        'Authorization': 'Bearer' + token
      }
    });
  }

};
