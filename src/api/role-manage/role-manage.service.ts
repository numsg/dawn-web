import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import { stringFormat } from '@gsafety/cad-gutil/dist/stringformat';
import { roleManageUrl } from '@/common/url/role-manage-url';

export default {


  /**
   *
   * 查询系统所有角色
   * @returns
   */
  getRoleList(): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.systemRoleListUrl, store.getters.configs.clientId);
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },


  /**
   *
   *  查询所有权限
   * @returns {Promise<any>}
   */
  getAllAuthority(): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.allAuthorityListUrl, store.getters.configs.clientId);
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },


  /**
   *
   * 添加角色
   * @param {*} roleInfo 角色信息
   * @returns {Promise<any>}
   */
  addRole(roleInfo: any): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.addRoleUrl, store.getters.configs.clientId);
    return httpClient.postPromise(url, roleInfo, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },


  /**
   *
   * 批量删除角色
   * @param {Array<string>} codes 角色code列表
   * @returns {Promise<any>}
   */
  deleteRoles(codes: Array<string>): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.deleteRolesUrl, store.getters.configs.clientId);
    return httpClient.postPromise(url, codes, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },


  /**
   *
   * 删除业务系统角色
   * @param {string} code 角色code
   * @returns
   */
  deleteRole(code: string): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.deleteRoleUrl, store.getters.configs.clientId, code);
    return httpClient.deletePromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },


  /**
   * 根据角色code 查询角色权限点
   * @param code
   */
  codeReferPris(code: string): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.rolePris, store.getters.configs.clientId, String(code));
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  /**
   *  menu_nodes
   * @param code
   */
  codeRoleMenus(code: string): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.roleMenus, store.getters.configs.clientId, String(code));
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });

  },

  /**
   * codeRolePris
   */
  codeRolePris(code: string): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.codeRolePris, store.getters.configs.clientId, String(code));
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },



  /**
   *
   * 根据角色code查询角色信息
   * @param {string} code 角色code
   * @returns
   */
  codeReferRoleDetail(code: string): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.codeReferRoleDetailUrl, store.getters.configs.clientId, code);
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },



  /**
   *
   * 修改角色信息
   * @param {string} code 角色code
   * @param {*} roleInfo 角色信息
   * @returns {Promise<any>}
   */
  modificationRoleDetail(code: string, roleInfo: any): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl +
      stringFormat(roleManageUrl.modificationRoleDetailUrl, store.getters.configs.clientId, String(code));
    return httpClient.putPromise(url, roleInfo, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },


  /**
   *
   * 根据角色code查询角色权限点<包括子权限点>
   * @param {string} code 角色code
   * @returns {Promise<any>}
   */
  codeReferRolePrivileges(code: string): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl +
      stringFormat(roleManageUrl.codeReferRolePrivilegesUrl, store.getters.configs.clientId, code);
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },


  /**
   *
   * 获取所有权限<privilege s>
   * @returns
   */
  allPrivileges() {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl +
      stringFormat(roleManageUrl.roleManageUrl, store.getters.configs.clientId) + '/privilege-nodes';
    return httpClient.getPromise(url, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },


  /**
   *
   * 批量为业务系统角色配置权限点<api资源 privilege>
   * @param {Array<string>} roleCodes role codes
   * @param {Array<string>} privilegeIds privilege id
   * @returns {Promise<any>}
   */
  handleRolePricileges(roleCodes: Array<string>, privilegeIds: Array<string>): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.roleManageUrl, store.getters.configs.clientId) + '/roles/privileges';
    return httpClient.postPromise(url, {
      roleCodes: roleCodes,
      privilegeIds: privilegeIds
    }, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },


  // 根据角色code查询角色菜单<包括子菜单>(功能资源 menu) manager
  roleCodeQueryMenuNodes(roleCode: string, path: any): Promise<any> {
    const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.roleManageUrl, store.getters.configs.clientId) + path + roleCode + '/menu_nodes';
    return httpClient.getPromise(url, { headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + token } });
  },



  /**
 * 根据角色 code 查询角色菜单  personal
 * @param rolecodes
 * @param menuIds
 */
  loginRoleCodeQueryMenuNodes(roleCode: string): Promise<any> {
    const token = store.getters.user_auth_token;
    // const token = store.getters.configs.superToken;
    const url = store.getters.configs.uapUrl
      + stringFormat(roleManageUrl.roleManageUrl, store.getters.configs.clientId) + '/user/roles/' + roleCode + '/menu_nodes';
    return httpClient.getPromise(url, { headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + token } });
  },



  /**
   * 角色批量添加menu
   *
   * @param {Array<string>} rolecodes
   * @param {Array<string>} menuIds
   * @param {Array<string>} menuIds
   * @returns {Promise<any>}
  /**
   *
   *
   * @param {Array<string>} rolecodes
   * @param {Array<string>} menuIds
   * @returns {Promise<any>}
   */
  handleRoleMenus(rolecodes: Array<string>, menuIds: Array<string>): Promise<any> {
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    const params = { roleCodes: rolecodes, menuIds: menuIds };
    const url = store.getters.configs.uapUrl + stringFormat(roleManageUrl.roleManageUrl, store.getters.configs.clientId) +
      '/roles/menu_nodes';
    return httpClient.postPromise(url, params, { headers: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + token } });
  },

  /**
   * 返回树结构的数据id集合
   *
   * @param {Array<any>} idList
   * @param {Array<any>} data
   * @returns
   */
  returnTreeIds(idList: Array<any>, data: Array<any>, identifying: string) {
    data.forEach(item => {
      if (item[identifying] && item.directAssociate === 0) {
        idList.push(item[identifying]);
      }
      if (item.hasChildren && item.children !== null && item.children.length > 0) {
        this.returnTreeIds(idList, item.children, identifying);
      }
    });
    return idList;
  },

  getChildren(data: any, newChildren: any) {
    data.forEach((item: any) => {
      newChildren.push(item);
      if (item.hasChildren && item.children !== null && item.children.length > 0) {
        this.getChildren(item.children, newChildren);
      }
      return newChildren;
    });
  },

  /**
   * 格式化多级树结构为二级树
   *
   * @param {Array<any>} data
   * @returns
   */
  getNewList(data: Array<any>) {
    data.forEach((item: any) => {
      const newChildren: any = [];
      if (item.hasChildren && item.children !== null) {
        this.getChildren(item.children, newChildren);
        item.children = newChildren;
      }
    });
    return data;
  },


  /**
   * 分页查询角色信息
   *
   * @param {*} param 分页参数
   * @returns {Promise<any>}
   */
  pageQueryRoles(param: any): Promise<any> {
    const url = store.getters.configs.uapUrl +
      stringFormat(roleManageUrl.roleManageUrl, store.getters.configs.clientId) + '/roles/search';
    // const token = store.getters.user_auth_token;
    const token = store.getters.configs.superToken;
    return httpClient.postPromise(url, param, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  }

};


