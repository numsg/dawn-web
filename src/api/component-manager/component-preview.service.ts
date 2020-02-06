import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import DataSource from '@/models/data-source/data-source';

import odataClient from '@gsafety/odata-client/dist';

export default {
  // 根据原件id查询原件
  queryComponentById(id: string): Promise<any> {
    const str = `cellId eq '${id}'`;
    return this.TemplateBasicQuery(id)
      .filter(str)
      .get()
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => { });
  },

  TemplateBasicQuery(dataSourceId: string): any {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'CellEntity'
    });
    return q.skip(0);
  },

  // 查询所有原件
  queryComponent(): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'CellEntity'
    });
    return q.count(true).top(1000)
      .get(null)
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        console.log(err);
      });
  },

  /**
   * 查询所有元件模板
   *
   * @returns {Promise<any>}
   */
  queryCellTemplate(): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'CellTemplateEntity'
    });
    return q.top(1000)
      .get(null)
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
};
