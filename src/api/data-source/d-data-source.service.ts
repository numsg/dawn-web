import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';

import DSourceDataModel from '@/models/data-source/d-source-data';

import odataClient from '@gsafety/odata-client/dist';
import { arrayToTree, treeToArray } from '@/common/utils/utils';
import mapperManager from '@/common/odata/mapper-manager.service';
import Guid from '@/utils/guid';

export default {
  /**
   * add new data source data
   *
   * @param {DSourceDataModel} data
   * @returns {Promise<any>}
   */
  addDDataSource(data: DSourceDataModel): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'data-source-data';
    return httpClient.postPromise(url, data).catch(error => {
      return error;
    });
  },

  /**
   * 根据数据源数据id删除一个数据源数据
   *
   * @param {string} dSourceDataId
   * @returns {Promise<any>}
   */
  deleteDDataSource(dSourceDataId: string): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'data-source-data/' + dSourceDataId;
    return httpClient.deletePromise(url);
  },

  /**
   * 修改数据源数据
   *
   * @param {DSourceDataModel} data
   * @returns {Promise<any>}
   */
  modifyDDataSource(data: DSourceDataModel): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'data-source-data';
    return httpClient.putPromise(url, data);
  },

  /**
   * 通过数据源数据id 查询数据源数据
   *
   * @param {string} dSourceDataId
   * @returns {Promise<any>}
   */
  findDSourceDataByIds(dSourceDataIds: string[]): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'data-source-data/ids';
    return httpClient.postPromise(url, dSourceDataIds);
  },

  /**
   * 通过数据源数据id 查询数据源数据
   * @param {string} dSourceDataId
   * @returns {Promise<any>}
   */
  findDSourceDataById(id: string): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'data-source-data/id/' + id;
    return httpClient.getPromise(url);
  },

  findDDataSourceByDataSourceId(dataSourceId: string): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'data-source-data/data-source-id/' + dataSourceId;
    return httpClient.getPromise(url);
  },

  // 通过数据源id查询数据源数据的id、name
  queryDDataSourceIdAndName(dataSourceId: any): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'DSourceDataEntity',
      format: 'json'
    });
    return q
      .filter('dataSourceId', 'eq', dataSourceId)
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

  /**
   * 通过datasource id 查询dataSourceData
   *
   * @param {string} dataSourceId
   * @returns {Promise<any>}
   */
  queryDDataSource(dataSourceId: string): Promise<any> {
    const str = `dataSourceId eq '${dataSourceId}'`;
    return this.TemplateBasicQuery(dataSourceId)
      .filter(str)
      .orderby('sort', 'asc')
      .get(null)
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {});
  },

  queryParentsOfData(dataSourceId: string, pid: string): Promise<any> {
    const str = `(dataSourceId eq '${dataSourceId}') and (pid eq '${pid}')`;
    return this.TemplateBasicQuery(dataSourceId)
      .filter(str)
      .get()
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {});
  },

  pidsQueryData(dataSourceId: string, pids: Array<string>): Promise<any> {
    let filterStr = '';
    pids.forEach((pid: any) => {
      // tslint:disable-next-line: quotemark
      filterStr += "(pid eq '" + pid.id + "') or ";
    });
    const str = `(dataSourceId eq '${dataSourceId}') and (${filterStr.substring(0, filterStr.length - 4)})`;
    return this.TemplateBasicQuery(dataSourceId)
      .filter(str)
      .get()
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {});
  },

  TemplateBasicQuery(dataSourceId: string): any {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'DSourceDataEntity'
    });
    return q.skip(0).expand('dataSourceEntity');
  },

  /**
   *
   *
   * @param {Array<any>} data
   * @param {string} pid
   * @returns {*}
   */
  buildTree(data: Array<any>, pid: string): any {
    let temp: any;
    const tree: any = [];
    data.forEach(item => {
      if (item.pid === pid) {
        const obj = {
          id: item.id,
          pid: item.pid,
          label: item.name,
          name: item.name,
          image: item.image,
          imgColor: item.imgColor,
          children: [],
          sort: item.sort,
          hidden: true,
          hiddenDelButton: true,
          hiddenInput: true,
          multiTenancy: item.multiTenancy,
          multiTenancyData: item.multiTenancyData
        };
        temp = this.buildTree(data, item.id);
        if (temp.length > 0) {
          obj.children = temp;
        }
        tree.push(obj);
      }
    });
    return tree;
  },

  // 修改数据源数据的顺序
  UpdateDSourceDataSort(DSourceDatas: any, type: any): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + '/data-source-data/sort';
    let temp = DSourceDatas;
    if (type === 1) {
      // 树形
      temp = treeToArray(DSourceDatas);
      temp.map((e: any) => (e.image = JSON.stringify(e.image)));
    } else {
      temp.map((e: any) => (e.image = JSON.stringify(e.image)));
    }
    // 列表型已排好顺序
    return httpClient.putPromise(url, temp);
  },

  // 数据转换
  entityToModel(result: any) {
    // tslint:disable-next-line:prefer-const
    let dSourceDataArr: DSourceDataModel[] = [];
    if (Array.isArray(result) && result.length > 0) {
      result.forEach(data => {
        let dSourceData = new DSourceDataModel();
        dSourceData = mapperManager.mapper(data, dSourceData);
        dSourceData.name = data.label;
        dSourceData.image = data.image ? JSON.stringify(data.image) : '';
        dSourceDataArr.push(dSourceData);
      });
    }
    return dSourceDataArr;
  }
};
