import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import { planSortUrl } from '@/common/url/plan-sort-url';
import { stringFormat } from '@gsafety/cad-gutil/dist/stringformat';
import odataClient from '@gsafety/odata-client/dist';
import mapperManager from '@/common/odata/mapper-manager.service';
import DistrictLevel from '@/models/template-manage/district-level';
import ResponseSub from '@/models/template-manage/response-sub';
import PlanUse from '@/models/template-manage/plan-use';

export default {

    /**
     * 获取所有预案行政级别
     * http方式
     *  @returns {Promise<any>}
     */

    HttpLoadDistrictLevel(): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = `${planPreparationUrl}${planSortUrl.LoaderDistrictLevels}`;
        return httpClient.getPromise(url);
    },


    /**
     * 获取所有预案行政级别
     * odta方式
     * @returns {Promise<any>}
     */
    LoadDistrictLevel(): Promise<any> {
        const q = odataClient({
            service: store.getters.configs.odataUrl,
            resources: 'DistrictLevelEntity'
        });
        return q.top(100).orderby('sort', 'asc').get(null)
            .then((response: any) => {
                return this.generateData(JSON.parse(response.body).value, DistrictLevel);
            }).catch((error: any) => {

            });
    },

    /**
     * 删除预案行政级别
     *
     * @param {*} id
     * @returns {Promise<any>}
     */
    DeleteDistrictLevel(id: any): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = stringFormat(`${planPreparationUrl}${planSortUrl.LoaderDistrictLevelById}`, id);
        return httpClient.deletePromise(url);
    },

    /**
     * 修改预案行政级别名称
     *
     * @param {*} id
     * @param {*} name
     * @returns {Promise<any>}
     */
    ModifyDistrictLevel(id: any, name: any): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = stringFormat(`${planPreparationUrl}${planSortUrl.LoaderDistrictLevelByIdAndName}`, id, name);
        return httpClient.putPromise(url);
    },

    /**
     * 修改预案行政级别
     *
     * @param {*}
     * @returns {Promise<any>}
     */
    UpdateDistrictLevel(districtLevel: DistrictLevel): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = stringFormat(`${planPreparationUrl}${planSortUrl.UpdateDistrictLevel}`);
        return httpClient.putPromise(url, districtLevel);
    },

    /**
     * 新增一个预案行政级别
     *
     * @param {*} districtLevel
     * @returns {Promise<any>}
     */
    AddDistrictLevel(districtLevel: any): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = `${planPreparationUrl}${planSortUrl.LoaderDistrictLevel}`;
        return httpClient.postPromise(url, districtLevel);
    },


    /**
     * 修改行政级别的顺序
     * @param districtLevels
     */
    UpdateDistrictLevelSort(districtLevels: any): Promise<any> {
        const url = store.getters.configs.planPreparationUrl + 'district-levels/sort';
        return httpClient.putPromise(url, districtLevels);
    },

    /**
     * 获取预案责任主体
     * http方式
     * @returns {Promise<any>}
     */

    HttpLoadResponseSub(): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = `${planPreparationUrl}${planSortUrl.LoaderResponseSubs}`;
        return httpClient.getPromise(url);
    },

    /**
     * 获取预案责任主体
     * odta方式
     * @returns {Promise<any>}
     */
    LoadResponseSub(): Promise<any> {
        const q = odataClient({
            service: store.getters.configs.odataUrl,
            resources: 'ResponseSubEntity'
        });
        return q.count(true).top(100).orderby('sort', 'asc')
            .get()
            .then((response: any) => {
                return this.generateData(JSON.parse(response.body).value, ResponseSub);
            }).catch((error: any) => {

            });
    },

    UpdateResponseSub(responseSub: ResponseSub): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = `${planPreparationUrl}${planSortUrl.updateResponseSub}`;
        return httpClient.putPromise(url, responseSub);
    },



    /**
     * 删除预案责任主体
     *
     * @param {*} id
     * @returns {Promise<any>}
     */
    DeleteResponseSub(id: any): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = stringFormat(`${planPreparationUrl}${planSortUrl.LoaderResponseSubById}`, id);
        return httpClient.deletePromise(url);
    },

    /**
     * 修改预案责任主体名称
     *
     * @param {*} id
     * @param {*} name
     * @returns {Promise<any>}
     */
    ModfiyResponseSub(id: any, name: any): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = stringFormat(`${planPreparationUrl}${planSortUrl.LoaderResponseSubByIdAndName}`, id, name);
        return httpClient.putPromise(url);
    },

    /**
     * 新增一个预案责任主体
     * @param responseSub
     */
    AddResponseSub(responseSub: any): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = `${planPreparationUrl}${planSortUrl.LoaderResponseSub}`;
        return httpClient.postPromise(url, responseSub);
    },

    /**
     * 修改责任主体的顺序
     * @param {*} responseSubs
     * @returns {Promise<any>}
     */
    UpdateResponseSubSort(responseSubs: any): Promise<any> {
        const url = store.getters.configs.planPreparationUrl + 'response-subs/sort';
        return httpClient.putPromise(url, responseSubs);
    },


    /**
     * 获取所有预案用途
     * http请求方式
     * @returns {Promise<any>}
     */
    HttpLoadPlanUse(): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = `${planPreparationUrl}${planSortUrl.LoaderPlanUses}`;
        return httpClient.getPromise(url);
    },

    /**
     * 获取所有预案用途
     * odata方式
     * @returns {Promise<any>}
     */
    LoadPlanUse(): Promise<any> {
        const q = odataClient({
            service: store.getters.configs.odataUrl,
            resources: 'PlanUseEntity'
        });
        return q.top(100).orderby('sort', 'asc').get(null)
            .then((response: any) => {
                return this.generateData(JSON.parse(response.body).value, PlanUse);
            }).catch((error: any) => {

            });
    },

    /**
     * 修改预案用途的顺序
     * @param {*} planUses
     * @returns {Promise<any>}
     */
    UpdatePlanUseSort(planUses: any): Promise<any> {
        const url = store.getters.configs.planPreparationUrl + 'plan-uses/sort';
        return httpClient.putPromise(url, planUses);
    },


    /**
     * 组装数据
     * @param {*} result
     * @param {*} ModeType
     * @returns
     */
    generateData(result: any, ModeType: any) {
        // tslint:disable-next-line:prefer-const
        let dataArr: any[] = [];
        if (Array.isArray(result) && result.length > 0) {
            result.forEach(res => {
                let item = new ModeType();
                item = mapperManager.mapper(res, item);
                dataArr.push(item);
            });
        }
        return dataArr;
    },

    /**
     * 修改预案用途名称
     *
     * @param {*} id
     * @param {*} name
     * @returns {Promise<any>}
     */
    ModifyPlanUse(id: any, name: any): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = stringFormat(`${planPreparationUrl}${planSortUrl.LoaderPlanUseByIdAndName}`, id, name);
        return httpClient.putPromise(url);
    },

    /**
     * 查询行政区划<地域>
     *
     * @returns {Promise<any>}
     */
    LoadDistrict(): Promise<any> {
        const q = odataClient({
            service: store.getters.configs.odataUrl,
            resources: 'DistrictEntity'
        });
        return q.skip(0).get(null)
            .then((response: any) => {
                return JSON.parse(response.body).value;
            }).catch((error: any) => {

            });
    },

    UpdatePlanUse(planUse: PlanUse): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = stringFormat(`${planPreparationUrl}${planSortUrl.UpdatePlanUse}`);
        return httpClient.putPromise(url, planUse);
    }

};
