import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import { eventTypeUrl } from '@/common/url/event-type-url';
import { stringFormat } from '@gsafety/cad-gutil/dist/stringformat';
import odataClient from '@gsafety/odata-client/dist';
import mapperManager from '@/common/odata/mapper-manager.service';
import EventType from '@/models/data-define/event-type';
import Event from '@/models/data-define/event';
import { arrayToTree, treeToArray } from '@/common/utils/utils';
import externalResourceService from '../external-resource/external-resource.service';

export default {
  /**
   * 获取所有事件类型
   *
   *
   */
  async HttpLoadEventTypes(): Promise<any> {
    if (false) {  // store.getters.configs.rmsConfig.useResourceServer
      const result = await externalResourceService.queryEventTypes();
      result.forEach((e: any) => {
        e.image = e.image ? JSON.parse(e.image.replace(/\'/g, '"')) : {};
      });
      return result;
    } else {
      const planPreparationUrl = store.getters.configs.planPreparationUrl;
      const url = `${planPreparationUrl}${eventTypeUrl.LoadEventTypes}`;
      return httpClient.getPromise(url);
    }
  },

  /**
   * 获取所有事件类型
   * odata方式
   * @returns {Promise<any>}
   */
  async LoadEventTypes(): Promise<any> {
    if (false) { // store.getters.configs.rmsConfig.useResourceServer
      const result = await externalResourceService.queryEventTypes();
      return this.generateTree(result);
    } else {
      const q = odataClient({
        service: store.getters.configs.odataUrl,
        resources: 'EventTypeEntity'
      });
      return q
        .top(1000)
        .get(null)
        .then((response: any) => {
          return this.generateTree(JSON.parse(response.body).value);
        });
    }
  },

  /**
   * 修改事件类型
   */
  updateEventType(eventType: EventType) {
    const planPreparationUrl = store.getters.configs.planPreparationUrl;
    const url = stringFormat(`${planPreparationUrl}${eventTypeUrl.UpdateEventType}`);
    return httpClient.putPromise(url, eventType);
  },

  /**
   * 获取树形结构数据
   * @param {*} result
   * @returns
   */
  generateTree(result: any) {
    const eventTypeArr: EventType[] = this.generateData(result);
    return arrayToTree(eventTypeArr);
  },

  /**
   * 组装数据
   * @param {*} result
   * @returns
   */
  generateData(result: any) {
    // tslint:disable-next-line:prefer-const
    let eventTypeArr: EventType[] = [];
    if (Array.isArray(result) && result.length > 0) {
      result.forEach(data => {
        let eventType = new EventType();
        eventType = mapperManager.mapper(data, eventType);
        eventType.label = data.name;
        eventType.image = data.image ? JSON.parse(data.image.replace(/\'/g, '"')) : {};
        eventType.iconString = this.arrayBufferToBase64(data.icon);
        eventType.imgColor = data.imgColor;
        eventTypeArr.push(eventType);
      });
    }
    return eventTypeArr;
  },

  /**
   * 组装数据
   * @param {*} buffer
   * @returns
   */
  arrayBufferToBase64(buffer: any) {
    let base64 = '';
    if (buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      base64 = 'data:image/png;base64' + window.btoa(binary);
    }
    return base64;
  },

  /**
   * 根据事件id获取其子事件
   * get
   * @param {string} eventId 事件类型id
   * @returns {Promise<any>}
   */
  HttpQueryByEventId(eventId: string): Promise<any> {
    const planPreparationUrl = store.getters.configs.planPreparationUrl;
    const url = stringFormat(`${planPreparationUrl}${eventTypeUrl.QueryByEventId}`, eventId);
    return httpClient.getPromise(url);
  },

  // odata
  QueryByEventId(eventId: string): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.odataUrl,
      resources: 'EventTypeEntity'
    });
    return q
      .filter('pid', '=', eventId)
      .get()
      .then((response: any) => {
        return this.generateData(JSON.parse(response.body).value);
      })
      .catch((err: any) => {
        console.log(err);
      });
  },

  /**
   *
   * 新增事件类型
   *
   * @param {any} eventType
   *
   * @returns {Promise<any>}
   */
  AddEventType(eventType: any): Promise<any> {
    const planPreparationUrl = store.getters.configs.planPreparationUrl;
    const url = `${planPreparationUrl}${eventTypeUrl.AddEventType}`;
    return httpClient.postPromise(url, eventType);
  },

  /**
   * 根据事件类型id 修改事件类型名称
   *
   * @param {string} eventID
   * @param {string} eventName
   * @returns {Promise<any>}
   */
  UpdateEventNameById(id: string, name: string): Promise<any> {
    const planPreparationUrl = store.getters.configs.planPreparationUrl;
    const url = stringFormat(`${planPreparationUrl}${eventTypeUrl.UpdateEventNameById}`, id, name);
    return httpClient.putPromise(url);
  },

  /**
   * 根据事件类型id 删除事件类型及其子事件
   * delete
   * @param {[]} eventType
   * @param {number} loadCount
   * @returns {Promise<any>}
   */
  DeleteEventsById(data: any): Promise<any> {
    const planPreparationUrl = store.getters.configs.planPreparationUrl;
    const url = stringFormat(`${planPreparationUrl}${eventTypeUrl.DeleteEventsById}`, data);
    return httpClient.deletePromise(url);
  },

  /**
   * 节点拖拽到其他节点
   */
  DraggleNodeToNode(id: string, pid: string): Promise<any> {
    const planPreparationUrl = store.getters.configs.planPreparationUrl;
    const url = stringFormat(`${planPreparationUrl}${eventTypeUrl.DraggleNodeToNode}`, id, pid);
    return httpClient.putPromise(url);
  },

  /**
   * 上传或重置图片
   */
  UploadImg(id: any, img: any): Promise<any> {
    const planPreparationUrl = store.getters.configs.planPreparationUrl;
    const url = stringFormat(`${planPreparationUrl}${eventTypeUrl.UploadImg}`, id);
    return httpClient.postPromise(url, img);
  },

  /**
   *查询所有事件类型
   *odta方式
   * @returns {Promise<any>}
   */
  queryEvent(): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.odataUrl,
      resources: 'EventTypeEntity'
    });
    return q
      .top(1000)
      .orderby('sort', 'asc')
      .get(null)
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        console.log(err);
      });
  },

  // 新增事件类型
  addEvent(event: Event): Promise<any> {
    const planPreparationUrl = store.getters.configs.planPreparationUrl;
    const url = `${planPreparationUrl}${eventTypeUrl.addEvent}`;
    return httpClient.postPromise(url, event);
  },

  // 修改事件类型
  updateEvent(event: any): Promise<any> {
    const planPreparationUrl = store.getters.configs.planPreparationUrl;
    const url = `${planPreparationUrl}${eventTypeUrl.updateEvent}`;
    return httpClient.putPromise(url, event);
  },

  // 删除事件类型
  deleteEvent(id: any): Promise<any> {
    const planPreparationUrl = store.getters.configs.planPreparationUrl;
    const url = stringFormat(`${planPreparationUrl}${eventTypeUrl.deleteEvent}`, id);
    return httpClient.deletePromise(url);
  },

  // 修改事件类型的顺序
  UpdateEventTypeSort(eventTypes: any): Promise<any> {
    const temp = treeToArray(eventTypes);
    const url = store.getters.configs.planPreparationUrl + 'event-types/sort';
    return httpClient.putPromise(url, this.entityToModel(temp));
  },

  // 根据pid查询事件类型
  queryEventByPid(pid: string): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.odataUrl,
      resources: 'EventTypeEntity'
    });
    return q.filter('pid', 'eq', pid).get().then((response: any) => {
      return JSON.parse(response.body).value;
    })
      .catch((err: any) => {
        console.log(err);
      });
  },

  // 资源 根据pid查询事件类型
  queryEventByPidResource(pid: string): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + 'rms/scenes/event-types/pid/' + pid;
    return httpClient.getPromise(url);
  },

  // 数据转换
  entityToModel(result: any) {
    // tslint:disable-next-line:prefer-const
    let eventTypeArr: Event[] = [];
    if (Array.isArray(result) && result.length > 0) {
      result.forEach(data => {
        let eventType = new Event();
        eventType = mapperManager.mapper(data, eventType);
        eventType.name = data.label;
        eventType.image = data.image ? JSON.stringify(data.image) : '';
        eventType.imgColor = data.imgColor;
        eventTypeArr.push(eventType);
      });
    }
    return eventTypeArr;
  }
};
