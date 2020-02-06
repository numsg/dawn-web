import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import DSourceDataModel from '@/models/data-source/d-source-data';
import DataSource from '@/models/data-source/data-source';
import { treeToArray } from '@/common/utils/utils';
import mapperManager from '@/common/odata/mapper-manager.service';
import Event from '@/models/data-define/event';

// 通讯录   0f577ab2-4a3a-4798-adb7-ac13c39c3382
// const CONTACT_RESOURCE_ID = store.getters.configs.resourceDataSourceIds.contactId;

export default {
  /**
   * 获取数据源
   * @returns
   */
  queryDataSource() {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/data-sources`;
    return httpClient.getPromise(url).catch(() => {
      return false;
    });
  },

  /**
   * 修改一个数据源
   * @param {*} dataSource
   * @returns {Promise<any>}
   */
  modifyDataSource(dataSource: DataSource): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/data-sources/${dataSource.originalId}`;
    return httpClient.putPromise(url, dataSource);
  },

  queryDataSourceById(dataSourceId: string): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/data-sources/${dataSourceId}`;
    return httpClient.getPromise(url);
  },

  /**
   * 根据id删除一个数据源
   * @param {string} dataSourceId
   * @returns {Promise<any>}
   */
  deleteDataSource(dataSourceId: string): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/data-sources/${dataSourceId}`;
    return httpClient.deletePromise(url);
  },

  /**
   * 根据数据源id获取数据源数据详情
   * @param {string} dataSourceId
   * @returns {Promise<any>}
   */
  findDDataSourceByDataSourceId(dataSourceId: string): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/d-source-data/${dataSourceId}`;
    return httpClient.getPromise(url);
  },

  /**
   * 通过数据源数据id 查询数据源数据
   * @param {string} dSourceDataIds
   * @returns {Promise<any>}
   */
  findDSourceDataByIds(dSourceDataIds: string[]): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/d-source-data/ids`;
    return httpClient.postPromise(url, dSourceDataIds);
  },

  /**
   * 通过数据源数据id 查询数据源数据
   * @param {string} id
   * @returns {Promise<any>}
   */
  findDSourceDataById(id: string): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/d-source-data/id/${id}`;
    return httpClient.getPromise(url);
  },

  /**
   * 通过数据源数据id 查询数据源数据
   * @param {string} id
   * @returns {Promise<any>}
   */
  queryDSourceDataByDataSourceId(dataSourceId: string): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/d-source-data/data-source-id/${dataSourceId}`;
    return httpClient.getPromise(url);
  },


  /**
   * 通过事件类型id 查询数据源数据
   * @param {string} id
   * @returns {Promise<any>}
   */
  queryDSourceDataByEventTypeId(id: string): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/d-sources-data/scenes/${id}`;
    return httpClient.getPromise(url);
  },

  /**
   * 根据数据源数据id删除一个数据源数据
   * @param {string} dSourceDataId
   * @returns {Promise<any>}
   */
  deleteDDataSource(dSourceDataId: string): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/d-source-data/${dSourceDataId}`;
    return httpClient.deletePromise(url);
  },

  /**
   * 修改数据源数据
   * @param {DSourceDataModel} data
   * @returns {Promise<any>}
   */
  modifyDDataSource(data: DSourceDataModel): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/d-source-data/${data.id}`;
    return httpClient.putPromise(url, data);
  },

  /**
   * 判断名称是否重复
   * @param {String} name
   */
  isNameDuplicate(name: string) {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/d-source-data/${encodeURIComponent(name.toString())}/check-repeat`;
    return httpClient.getPromise(url);
  },

  /**
   * add new data source data
   * @param {DSourceDataModel} data
   * @returns {Promise<any>}
   */
  addDDataSource(data: DSourceDataModel): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + 'rms/resource-types/d-source-data';
    return httpClient.postPromise(url, data).catch(error => {
      return error;
    });
  },

  /**
   * 根据资源类型id查询资源
   * @param {String} id
   * @returns
   */
  queryResourcesById(id: string) {
    const url = store.getters.configs.externalAccessUrl + `rms/resources/type/${id}`;
    return httpClient.getPromise(url).catch(error => {
      return error;
    });
  },

  /**
   * 修改数据源数据的顺序
   * @param {any[]} DSourceDatas
   * @returns {Promise<any>}
   */
  updateDSourceDataSort(DSourceDatas: any[]): Promise<any> {
    DSourceDatas.forEach(e => {
      e.image = JSON.stringify(e.image);
      if (e.image === '""') {
        e.image = '';
      }
    });
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/d-source-data/update-sort`;
    return httpClient.putPromise(url, DSourceDatas);
  },

  /**
   *查询事件类型
   */
  queryEventTypes() {
    const url = store.getters.configs.externalAccessUrl + `rms/scenes/event-types`;
    return httpClient.getPromise(url);
  },

  /**
   * 修改事件类型
   * @param {*} eventType
   * @returns
   */
  updateEventType(eventType: any) {
    const url = store.getters.configs.externalAccessUrl + `rms/scenes/event-types/${eventType.id}`;
    return httpClient.putPromise(url, eventType);
  },

  /** 新增事件类型
   * @param {Event} event
   * @returns {Promise<any>}
   */
  addEventType(eventType: any): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/scenes/event-types`;
    return httpClient.postPromise(url, eventType);
  },

  /**
   * 删除事件类型
   * @param {string} id
   * @returns {Promise<any>}
   */
  deleteEventType(id: string): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `rms/scenes/event-types/${id}`;
    return httpClient.deletePromise(url);
  },

  /**
   * 修改事件类型的顺序
   * @param {*} eventTypes
   * @returns {Promise<any>}
   */
  updateEventTypeSort(eventTypes: any): Promise<any> {
    const temp = treeToArray(eventTypes);
    const url = store.getters.configs.externalAccessUrl + 'rms/scenes/event-types/update-sort';
    return httpClient.putPromise(url, this.entityToModel(temp));
  },

  /**
   * 获取通讯录资源数据
   * @returns
   */
  queryContactResourceData() {
    const url = store.getters.configs.externalAccessUrl + `rms/resources/types/code/${store.getters.configs.resourceDataSourceIds.contactId}`;
    return httpClient.getPromise(url);
  },

  /**
   * 数据转换
   * @param {*} result
   * @returns
  //  */
  entityToModel(result: any) {
    const eventTypeArr: Event[] = [];
    if (Array.isArray(result) && result.length > 0) {
      result.forEach(data => {
        let eventType = new Event();
        eventType = mapperManager.mapper(data, eventType);
        eventType.name = data.label;
        data.image = JSON.stringify(data.image);
        // tslint:disable-next-line:quotemark
        eventType.image = data.image !== '""' ? data.image.replace(/\"/g, "'") : '';
        eventType.imgColor = data.imgColor;
        eventTypeArr.push(eventType);
      });
    }
    return eventTypeArr;
  }
};
