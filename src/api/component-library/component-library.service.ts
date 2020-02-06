
import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';

import odataClient from '@gsafety/odata-client/dist';
import cellModel from '@/models/component-libry/cell-model';
import FormatCellModel from '@/models/component-libry/format-call';

export default {



    /**
     * 条件查询元件列表<关键字查询没写>
     *
     * @param {number} page 页码
     * @param {number} count 加载量
     * @param {string} queryEventTypes 要查询的事件类型
     * @param {any} typeArray 事件类型
     * @returns
     */
    pageQueryComponentList(page: number, count: number, queryEventTypes: Array<string>, typeArray: Array<any>) {
        const q = odataClient({
            service: store.getters.configs.baseSupportOdataUrl,
            resources: 'CellEntity',
        });
        let filterStr = '';
        queryEventTypes.forEach((eventType: any) => {
            filterStr += '(eventTypeId eq \'' + Number.parseInt(eventType, 10) + '\') or ';
        });
        return q.skip(count * page).top(count)
            .filter('(' + filterStr.substring(0, filterStr.length - 4) + ')')
            .get(null)
            .then((response: any) => {
                return this.buildCellModel(JSON.parse(response.body).value, typeArray);
            }).catch((error: any) => { });
    },

    queryComponentList(typeArray: Array<any>): Promise<any> {
        const q = odataClient({
            service: store.getters.configs.baseSupportOdataUrl,
            resources: 'CellEntity',
        });
        return q.skip(0)
            .get(null)
            .then((response: any) => {
                return this.buildCellModel(JSON.parse(response.body).value, typeArray);
            }).catch((error: any) => { });
    },



    /**
     * 新增元件
     *
     * @param {*} param
     * @returns {Promise<any>}
     */
    addComponentCell(param: any): Promise<any> {
        const url = store.getters.configs.baseSupportUrl + 'cells';
        return httpClient.postPromise(url, param);
    },


    /**
     * 删除元件
     *
     * @param {string} cellId 元件id
     * @returns {Promise<any>}
     */
    deleteComponentCell(cellId: string): Promise<any> {
        const url = store.getters.configs.baseSupportUrl + 'cells/' + cellId;
        return httpClient.deletePromise(url);
    },


    /**
     * 修改元件
     *
     * @param {*} cellModel
     * @returns {Promise<any>}
     */
    modifyComponentCell(cellModel: cellModel): Promise<any> {
        const url = store.getters.configs.baseSupportUrl + 'cells';
        return httpClient.putPromise(url, cellModel);
    },

    // 根据原件id查询原件
    queryComponentById(id: string): Promise<any> {
        const filterStr = `id eq '${id}'`;
        const q = odataClient({
            service: store.getters.configs.baseSupportOdataUrl,
            resources: 'CellEntity'
        });
        return q.skip(0).filter(filterStr).get().then((response: any) => {
            return this.buildCellModel(JSON.parse(response.body).value);
        }).catch((err: any) => {

        });
    },

    // 根据原件id查询原件
    queryComponentByIds(ids: string[]): Promise<any> {
        let filterStr = '';

        for (let i = 0, len = ids.length - 1; i < ids.length; i++) {
            const id = ids[i];
            const suffix = i === len ? '' :  ' or ';
            filterStr += '(id eq \'' + id + '\')' + suffix;
        }
        const q = odataClient({
            service: store.getters.configs.baseSupportOdataUrl,
            resources: 'CellEntity'
        });
        return q.skip(0).filter(filterStr).get().then((response: any) => {
            return this.buildCellModel(JSON.parse(response.body).value);
        }).catch((err: any) => {

        });
    },

    buildCellModel(data: Array<cellModel>, typeArray?: Array<any>) {
        const newArr: Array<FormatCellModel> = [];
        if (Array.isArray(data) && data.length > 0) {
            data.forEach((item: cellModel) => {
                const cell = new FormatCellModel();
                cell.cellTypeId = item.cellTypeId;
                cell.editTime = item.editTime;
                cell.eventTypeId = item.eventTypeId;
                cell.eventTypeIcon = typeArray ? typeArray.find((type: any) => type.id === item.eventTypeId).icon : '';
                cell.id = item.id;
                cell.key = item.key;
                cell.name = item.name;
                cell.widgetCount = item.widgetCount;
                cell.data = item.data && item.data.length > 0 ? JSON.parse(String(item.data)) : [];
                cell.layout = item.layout && item.layout.length > 0 ? JSON.parse(String(item.layout)) : [];
                cell.tag = item.tag && item.tag.length > 0 ? JSON.parse(String(item.tag)) : [];
                cell.widgets = item.widgets && item.widgets.length > 0 ? JSON.parse(String(item.widgets)) : [];
                cell.rules = item.rules && item.rules.length > 0 ? JSON.parse(String(item.rules)) : [];
                cell.extraInfo = item.extraInfo && item.extraInfo.length > 0 ? JSON.parse(String(item.extraInfo)) : {};
                newArr.push(cell);
            });
        }
        return newArr;
    }

};
