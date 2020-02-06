import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import { stringFormat } from '@gsafety/cad-gutil/dist/stringformat';
import axios, { AxiosResponse } from 'axios';
import privilegeManageUrl from '@/common/url/privilege-manage-url';
import Privilege from '@/models/resource-manage/privilege';

export default {

    /**
     * 添加权限
     * @param {Privilege} privilege
     * @returns
     */
    addprivilege(privilege: Privilege) {
        const url = store.getters.configs.uapUrl + stringFormat(privilegeManageUrl.addprivilege, store.getters.configs.clientId);
        // const token = store.getters.user_auth_token;
        const token = store.getters.configs.superToken;
        return httpClient.postPromise(url, privilege, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
    },

    /**
     * 查询业务系统权限点
     */
    queryAllPrivilegeNodes() {
        const url = store.getters.configs.uapUrl + stringFormat(privilegeManageUrl.queryAllPrivilegeNodes, store.getters.configs.clientId);
        // const token = store.getters.user_auth_token;
        const token = store.getters.configs.superToken;
        return httpClient.getPromise(url, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
    },

    /**
     * 查询业务系统根权限点（不包括子权限点）
     * @returns
     */
    queryPrivilegeRootNodes() {
        const url = store.getters.configs.uapUrl + stringFormat(privilegeManageUrl.queryPrivilegeRootNodes, store.getters.configs.clientId);
        // const token = store.getters.user_auth_token;
        const token = store.getters.configs.superToken;
        return httpClient.getPromise(url, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
    },

    /**
     * 根据Id查询业务系统权限点（包括子权限点）
     * @param {String} id
     * @returns
     */
    queryPrivilegeNodeById(id: string) {
        const url = store.getters.configs.uapUrl
            + stringFormat(privilegeManageUrl.queryPrivilegeNodeById, store.getters.configs.clientId, String(id));
        // const token = store.getters.user_auth_token;
        const token = store.getters.configs.superToken;
        return httpClient.getPromise(url, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
    },

    /**
     * 根据父权限点id查询子权限点(包括下级权限点)
     * @param {String} pid
     * @returns
     */
    queryPrivilegeChildNodesByPid(pid: string) {
        const url = store.getters.configs.uapUrl
            + stringFormat(privilegeManageUrl.queryPrivilegeChildNodesByPid, store.getters.configs.clientId, String(pid));
        // const token = store.getters.user_auth_token;
        const token = store.getters.configs.superToken;
        return httpClient.getPromise(url, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
    },

    /**
     *  批量删除业务系统权限点（包括子权限点）
     * @param {String[]} ids
     * @returns
     */
    deletePrivileges(ids: string[]) {
        const url = store.getters.configs.uapUrl + stringFormat(privilegeManageUrl.deletePrivileges, store.getters.configs.clientId);
        // const token = store.getters.user_auth_token;
        const token = store.getters.configs.superToken;
        return httpClient.postPromise(url, ids, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
    },

    /**
     * 删除业务系统权限点（包括子权限点）
     * @param {String} id
     * @returns
     */
    deletePrivilegeById(id: string) {
        const url = store.getters.configs.uapUrl
            + stringFormat(privilegeManageUrl.deletePrivilegeById, store.getters.configs.clientId, String(id));
        // const token = store.getters.user_auth_token;
        const token = store.getters.configs.superToken;
        return axios.delete(url, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then((response: AxiosResponse) => {
            if (response.status === 200) {
                return true;
            }
            return false;
        });
    },

    /**
     * 修改业务系统权限点信息
     * @param {String} id
     * @param {Privilege} privilege
     * @returns
     */
    updatePrivilege(id: string, privilege: Privilege) {
        const url = store.getters.configs.uapUrl
            + stringFormat(privilegeManageUrl.updatePrivilege, store.getters.configs.clientId, String(id));
        const token = store.getters.configs.superToken;
        return httpClient.putPromise(url, privilege, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
    }
};
