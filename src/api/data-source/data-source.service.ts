import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import DataSource from '@/models/data-source/data-source';

import odataClient from '@gsafety/odata-client/dist';

export default {

  queryAllDataSources(): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'data-sources/' + store.getters.configs.rmsConfig.useResourceServer;
    return httpClient.getPromise(url);
  },


  /**
   * 添加一个数据源
   *
   * @param {*} data
   * @returns {Promise<any>}
   */
  addDataSource(data: DataSource): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'data-sources';
    return httpClient.postPromise(url, data);
  },

  /**
   * 根据id删除一个数据源
   *
   * @param {string} dataSourceId
   * @returns {Promise<any>}
   */
  deleteDataSource(dataSourceId: string): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'data-sources/' + dataSourceId;
    return httpClient.deletePromise(url);
  },

  /**
   * 修改一个数据源
   *
   * @param {*} dataSource
   * @returns {Promise<any>}
   */
  modifyDataSource(dataSource: DataSource): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'data-sources';
    return httpClient.putPromise(url, dataSource);
  },

  // odata
  /**
   * 查询所有数据源
   */
  queryDataSource(): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'DataSourceEntity'
    });
    return q
      .top(1000)
      .get(null)
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        return false;
      });
  },

  /**
   * 根据id查询一个数据源
   *
   * @param {string} dataSourceId
   * @returns {Promise<any>}
   */
  queryOneDataSource(dataSourceId: string): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'DataSourceEntity',
      format: 'json'
    });
    return q
      .filter('id', 'eq', dataSourceId)
      .get()
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        console.log(err);
      });
  },

  /**
   * 查询一个数据源的名称和id
   */
  queryOneDataSourceNameAndId(dataSourceId: string): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'DataSourceEntity',
      format: 'json'
    });
    return q
      .filter('id', 'eq', dataSourceId)
      .select('id', 'name')
      .top(1000)
      .get()
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        console.log(err);
      });
  },

  treeToTiledArr(tiledArr: Array<any>, data: Array<any>) {
    data.forEach(item => {
      if (item) {
        tiledArr.push(item);
      }
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        this.treeToTiledArr(tiledArr, item.children);
      }
    });
    return tiledArr;
  }
};
