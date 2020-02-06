
import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import User from '@/models/user-manage/user';
import menuManageUrl from '@/common/url/menu-manage-url';
import { stringFormat } from '@gsafety/cad-gutil/dist/stringformat';
import axios, { AxiosResponse } from 'axios';
import MenuInfo from '@/models/resource-manage/menu-info';

export default {

    /**
     * 添加菜单
     */
    addMenu(menu: MenuInfo) {
        const url = store.getters.configs.uapUrl + stringFormat(menuManageUrl.addMenu, store.getters.configs.clientId);
        // const token = store.getters.user_auth_token;
        const token = store.getters.configs.superToken;
        return httpClient.postPromise(url, menu, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
    },

    /**
     * 查询业务系统菜单
     * @returns
     */
    queryMenuNodes() {
        const url = store.getters.configs.uapUrl + stringFormat(menuManageUrl.queryMenuNodes, store.getters.configs.clientId);
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
     * 查询系统一级菜单
     */
    queryMenuRootNodes() {
        const url = store.getters.configs.uapUrl + stringFormat(menuManageUrl.queryMenuRootNodes, store.getters.configs.clientId);
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
     * 根据Id查询业务系统菜单（包括子菜单）
     * @param {String} id
     * @returns
     */
    queryMenuNodesByid(id: string) {
        const url = store.getters.configs.uapUrl
            + stringFormat(menuManageUrl.queryMenuNodesById, store.getters.configs.clientId, String(id));
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
     * 修改业务系统菜单
     * @param {String} id
     * @param {MenuInfo} menu
     * @returns
     */
    updateMenuNode(id: string, menu: MenuInfo) {
        const url = store.getters.configs.uapUrl
            + stringFormat(menuManageUrl.updateMenuNode, store.getters.configs.clientId, String(id));
        // const token = store.getters.user_auth_token;
        const token = store.getters.configs.superToken;
        return httpClient.putPromise(url, menu, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
    },

    /**
     * 删除业务系统菜单
     * @param {String} id
     * @returns
     */
    deleteMenuNode(id: string) {
        const url = store.getters.configs.uapUrl
            + stringFormat(menuManageUrl.updateMenuNode, store.getters.configs.clientId, String(id));
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
    }

};
