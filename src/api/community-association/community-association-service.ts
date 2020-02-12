import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import { stringFormat } from '@gsafety/cad-gutil/dist/stringformat';
import odataClient from '@gsafety/odata-client/dist';

import { RoleAreaCodeInfo } from '@/models/community-association/role-areacode-info';
import { CommunityConditionInfo } from '@/models/community-association/community-condition';

export default {
    /**
     * getAreaCodeInfos
     * 查询所有行政区划
     */
    getAreaCodeInfos(code: string) {
        try {
            const q = odataClient({
                service: store.getters.configs.communityManagerOdataUrl,
                resources: 'DistrictEntity',
            });
            const filterStr = '(parentId eq \'' + code + '\')';
            return q.skip(0)
                .filter(filterStr)
                .count(true)
                .get(null)
                .then((response: any) => {
                const result = {
                    count: JSON.parse(response.body)['@odata.count'],
                    value: JSON.parse(response.toJSON().body).value,
                };
                return result;
                })
                .catch((error: any) => []);
        } catch (e) {
            console.log(e);
            return [];
        }
    },
    getAreaCodeBycode(codes: string[]) {
        try {
            const q = odataClient({
                service: store.getters.configs.communityManagerOdataUrl,
                resources: 'DistrictEntity',
            });
            let filterStr = '';
            codes.forEach( (code, index: number) => {
                if ( index > 0 ) {
                    filterStr += ' or (districtCode eq \'' + code + '\')';
                } else {
                    filterStr += '(districtCode eq \'' + code + '\')';
                }
            });
            return q.skip(0)
                .filter(filterStr)
                .count(true)
                .get(null)
                .then((response: any) => {
                const result = {
                    count: JSON.parse(response.body)['@odata.count'],
                    value: JSON.parse(response.toJSON().body).value,
                };
                return result.value;
                })
                .catch((error: any) => []);
        } catch (e) {
            console.log(e);
            return [];
        }
    },
    /**
     * 根据用户角色查询区划
     * @param roleID
     */
    getDistrictById(id: string) {
        try {
            const url: string = store.getters.configs.communityManagerUrl + 'role-ass-community/query-roles';
            return httpClient
            .postPromise(url, [id])
            .then(res => {
                return res;
            })
            .catch(err => {
                return false;
            });
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    /**
     * 查询所有角色与区划的关联关系
     */
    getAllRelationsInfos(condition: CommunityConditionInfo) {
        try {
            // RoleAssCommunityEntity
            const q = odataClient({
                service: store.getters.configs.communityManagerOdataUrl,
                resources: 'RoleAssCommunityEntity',
            });
            const filterStr = '';
            // const filterStr = '(parentId eq \'' + code + '\')';
            if ( filterStr ) {
                return q
                .skip(condition.pageSize * (condition.page - 1))
                .top(condition.pageSize)
                .filter(filterStr)
                .orderby('updateTime', 'esc')
                .count(true)
                .get(null)
                .then((response: any) => {
                const result = {
                    count: JSON.parse(response.body)['@odata.count'],
                    value: JSON.parse(response.toJSON().body).value,
                };
                return result;
                })
                .catch((error: any) => []);
            } else {
                return q
                .skip(condition.pageSize * (condition.page - 1))
                .top(condition.pageSize)
                .orderby('updateTime', 'esc')
                .count(true)
                .get(null)
                .then((response: any) => {
                const result = {
                    count: JSON.parse(response.body)['@odata.count'],
                    value: JSON.parse(response.toJSON().body).value,
                };
                return result;
                })
                .catch((error: any) => []);
            }
        } catch (e) {
            console.log(e);
            return [];
        }
    },
    queryRelationsByconditions() {

    },
    addRelationsInfo(pyload: any) {
        try {
            const url: string = store.getters.configs.communityManagerUrl + 'role-ass-community/add';
            return httpClient
            .postPromise(url, pyload)
            .then(res => {
                return res;
            })
            .catch(err => {
                return false;
            });
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    /**
     * 修改角色与区划的关联关系
     */
    editRelationsInfo(info: RoleAreaCodeInfo) {
        try {
            const url: string = store.getters.configs.communityManagerUrl + 'role-ass-community/update';
            return httpClient
            .putPromise(url, [info])
            .then(res => {
                return res;
            })
            .catch(err => {
                return false;
            });

        } catch (e) {
            console.log(e);
            return false;
        }
    },
    /**
     * 删除角色与区划的关联关系
     * @param id
     */
    deleteRelationInfos(ids: string[]) {
        try {
            const url: string = store.getters.configs.communityManagerUrl + 'role-ass-community/delete';
            return httpClient
            .postPromise(url, ids)
            .then(res => {
                return res;
            })
            .catch(err => {
                return false;
            });
        } catch (e) {
            console.log(e);
            return false;
        }
    }
};
