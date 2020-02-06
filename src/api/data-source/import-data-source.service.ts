import store from '@/store';
import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';

export default {
  /**
   * 导入单层结构数据源
   *
   * @param {*} file
   * @returns {Promise<any>}
   */
  importSingleDataSource(file: any): Promise<any> {
    const url = store.getters.configs.planFileUrl + 'data-source-single/import';
    return httpClient.postPromise(url, file);
  },

  /**
   *树形数据源导入
   *
   * @param {*} file
   * @returns {Promise<any>}
   */
  importTreeDataSource(file: any): Promise<any> {
    const url = store.getters.configs.planFileUrl + 'data-source-tree/import';
    return httpClient.postPromise(url, file).catch((err: any) => {
      return err;
    });
  },

  /**
   *混合导入数据源
   *
   * @param {*} file
   * @returns {Promise<any>}
   */
  importBlendDataSource(file: any): Promise<any> {
    const url = store.getters.configs.planFileUrl + 'data-source-blend/import';
    return httpClient.postPromise(url, file);
  },



  /**
   * 批量导入
   */
  imporDataSourceBatch(dataSource: any): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'data-sources/batch/' + false;
    return httpClient.postPromise(url, dataSource);
  }
};
