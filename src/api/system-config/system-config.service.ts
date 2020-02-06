import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import odataClient from '@gsafety/odata-client/dist';
import SystemConfig from '@/models/common/system-config-model';
import mapperManager from '@/common/odata/mapper-manager.service';

export default {
  /**
   * 添加一个配置项
   * @param systemConfig  配置项
   */
  addOneConfig(systemConfig: SystemConfig): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'system-configs';
    return httpClient.postPromise(url, systemConfig);
  },

  /**
   * 修改一个配置项
   * @param systemConfig  配置项
   */
  updateOneConfig(systemConfig: SystemConfig): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'system-configs/' + systemConfig.id;
    return httpClient.putPromise(url, systemConfig);
  },
  /**
   * 删除一个配置项
   * @param configId id
   */
  deleteOneConfig(configId: any): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'system-configs/' + configId;
    return httpClient.deletePromise(url);
  },

  /**
   * 通过名称查询数量，用来判断重复
   * @param name 名称
   */
  queryCountByName(name: any): Promise<any> {
    const filterStr = '(name eq \'' + name + '\')';
    return this.queryCountByFilter(filterStr);
  },

  /**
   * 通过key查询数量，用来判断重复
   * @param key key
   */
  queryCountByKey(key: any): Promise<any> {
    const filterStr = '(key eq \'' + key + '\')';
    return this.queryCountByFilter(filterStr);
  },

  queryCountByFilter(filterStr: any): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'SystemConfigEntity'
    });

    return q
      .count(true)
      .filter(filterStr)
      .get(null)
      .then((response: any) => {
        const result = {
          count: JSON.parse(response.body)['@odata.count'],
          value: JSON.parse(response.body).value
        };
        return result;
      })
      .catch((error: any) => { });
  },
  /**
   * 查询所有配置项
   */
  LoadSystemConfigs(url?: string): Promise<any> {
    const q = odataClient({
      service: url || store.getters.configs.baseSupportOdataUrl,
      resources: 'SystemConfigEntity'
    });
    return q
      .skip(0)
      .orderby('id', 'asc')
      .get(null)
      .then((response: any) => {
        return this.dataMapper(JSON.parse(response.body).value, SystemConfig);
      })
      .catch((error: any) => { });
  },

  /**
   * 数据转换
   * @param {*} result
   * @param {*} ModeType
   * @returns
   */
  dataMapper(result: any, ModeType: any) {
    // tslint:disable-next-line:prefer-const
    const dataArr: any[] = [];
    if (Array.isArray(result) && result.length > 0) {
      result.forEach(res => {
        let item = new ModeType();
        item = mapperManager.mapper(res, item);
        dataArr.push(item);
      });
    }
    return this.generateData(dataArr, '-1');
  },

  /**
   * 组装数据
   * @param dataArr
   * @param id
   */
  generateData(dataArr: any, id: any) {
    const result: any[] = [];
    dataArr.forEach((item: any) => {
      if (item.pid === id) {
        item.children = this.generateData(dataArr, item.id);
        result.push(item);
      }
    });
    return result;
  },

  /**
   * @param {*} systemConfigs
   */
  toConvertJsonStr(systemConfigs: any) {
    const res = {} as any;
    this.buildData(systemConfigs, res);
    return res;
  },

  buildData(configs: any[], res: any) {
    configs.forEach(e => {
      if (e.children) {
        const child = {} as any;
        e.children.forEach((c: any) => {
          let val: any;
          try {
            val = JSON.parse(c.value);
          } catch (error) {
            val = c.value;
          }
          child[c.key] = val;
        });
        res[e.key] = child;
      }
    });
  }
};
