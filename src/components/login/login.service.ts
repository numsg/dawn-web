import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
// import { Md5 } from 'ts-md5/dist/md5';
import { gauthUrl } from '@/common/url/gauth-url';
import { stringFormat } from '@gsafety/cad-gutil/dist/stringformat';
import { roleManageUrl } from '@/common/url/role-manage-url';
import {Base64} from 'js-base64';
const loginInfo = {
  username: 'numsg@gsafety.com',
  password: loadPassword()
};

function loadPassword(): string {
  return '123456';
}

export default {
  reData(ret: any): Promise<{}> {
    return new Promise((resolve, reject) => {
      if (ret) {
        resolve(ret);
      } else {
        reject({ error: 'has error' });
      }
    });
  },

  postLogin(username: any, password: any) {
    let url = stringFormat(
      gauthUrl.oauth,
      store.getters.configs.clientId,
      store.getters.configs.clientSecret,
      store.getters.configs.scope.replace(/,/g, '%20'),
      username,
      Base64.encode(password).toString()
    );
    url = store.getters.configs.uapUrl + url;
    return httpClient.postPromise(url);
  },

  postLogout() {
    return this.reData({
      data: {
        success: false,
        message: ''
      }
    }).catch(ex => {
      throw ex;
    });
  },
  getUserInfo() {
    return this.reData({
      data: {
        name: 'Seed Pro',
        // avatar: './images/logo.png',
        roles: ['admin']
      }
    }).catch(ex => {
      throw ex;
    });
  },

  // 获取用户拥有的角色
  getUserRoleInfo(url: any): Promise<any> {
    const token = store.getters.user_auth_token;
    const path = store.getters.configs.uapUrl + stringFormat(roleManageUrl.roleManageUrl, store.getters.configs.clientId) + url;
    return httpClient
      .getPromise(path, {
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      .catch(error => {
        return false;
      });
  },

  // 普通用户获取所有角色
  // getPersonalRoles(): Promise<any> {
  //   const token = store.getters.user_auth_token;
  //   const url = store.getters.configs.uapUrl + stringFormat(roleManageUrl.roleManageUrl, store.getters.configs.clientId) + '/user/roles';
  //   return httpClient
  //     .getPromise(url, {
  //       headers: {
  //         'content-type': 'application/json',
  //         Authorization: 'Bearer ' + token
  //       }
  //     })
  //     .catch(error => {
  //       return false;
  //     });
  // },

  // 登陆验证
  postLoginVali(username: any, password: any) {
    // let url = stringFormat(
    //   gauthUrl.oauth,
    //   store.getters.configs.clientId,
    //   store.getters.configs.clientSecret,
    //   store.getters.configs.scope.replace(/,/g, '%20'),
    //   username,
    //   Md5.hashStr(password).toString()
    // );
    // console.log(Md5.hashStr(password).toString());

    // url = store.getters.configs.uapUrl + url;
    const url = store.getters.configs.uapUrl + '/v3/oauth/token';
    const data: any = {
      clientId: store.getters.configs.clientId,
      clientSecret: store.getters.configs.clientSecret,
      grantType: 'password',
      userName: username,
      password: Base64.encode(password).toString()
    };
    return httpClient.postPromise(url, data);
  }
};
