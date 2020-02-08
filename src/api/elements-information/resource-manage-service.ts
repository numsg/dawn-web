import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import odataClient from '@gsafety/odata-client/dist';

// 需要修改 url
export default {
  /**
   * 获取数据源
   */
  queryDataSource() {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/data-sources`;
    return httpClient.getPromise(url).catch(() => {
      return false;
    });
  },
  /**
   * 条件筛选资源
  */
  querySourceBysearch(search: string) {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/data-sources`;
    return httpClient.getPromise(url).catch(() => {
      return false;
    });
  },
  /**
   * 资源出库
   */
  transferResource(resourceInfo: any) {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/data-sources`;
    return httpClient.postPromise(url, resourceInfo).catch(() => {
      return false;
    });
  },
  /**
   * 出入库记录
   */
  resourceRecords(resourceId: string) {
    const url = store.getters.configs.externalAccessUrl + `rms/resource-types/data-sources/${resourceId}`;
    return httpClient.getPromise(url).catch(() => {
      return false;
    });
  },
  /**
   * 删除资源
   */
  deleteResource(resourceId: string) {
    const url = store.getters.configs.externalAccessUrl + `rms/scenes/event-types/${resourceId}`;
    return httpClient.deletePromise(url);
  },
  /**
   * 编辑资源
   */
  editResource( resource: any ) {
    const url = store.getters.configs.externalAccessUrl + `rms/scenes/event-types/${resource}`;
    return httpClient.postPromise(url);
  },
  /** 新增资源
   *
   */
  addResource(resource: any): Promise<any> {
    const url = store.getters.configs.externalAccessUrl + `新增资源`;
    return httpClient.postPromise(url, resource);
  },
};
