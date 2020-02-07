import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import { treeToArray } from '@/common/utils/utils';
import mapperManager from '@/common/odata/mapper-manager.service';
import EpidemicPerson from '@/models/home/epidemic-persion';
import odataClient from '@gsafety/odata-client/dist';
import moment from 'moment';

export default {
  /**
   * 添加疫情人员
   * @param epidemicPerson
   */
  addEpidemicPerson(epidemicPerson: EpidemicPerson) {
    const url = store.getters.configs.communityManagerUrl + `epidemic-person`;
    return httpClient.postPromise(url, epidemicPerson);
  },

  /**
   * 根据id查询疫情人员
   */
  queryEpidemicPersonById(id: string) {
    const q = odataClient({
      service: store.getters.configs.communityManagerOdataUrl,
      resources: 'EpidemicPersonEntity'
    });
    return q
      .filter('id', '=', id)
      .get()
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        console.log(err);
      });
  },

  /**
   * 分页查询疫情人员信息
   * @param page
   * @param count
   */
  queryEpidemicPersons(page: number, count: number) {
    const filterStr = '';
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'EpidemicPersonEntity'
    });
    return (
      q
        .skip(count * page)
        .top(count)
        //   .filter(filterStr)
        .orderby('submitTime', 'desc')
        .count(true)
        .get(null)
        .then((response: any) => {
          const result = {
            count: JSON.parse(response.body)['@odata.count'],
            value: JSON.parse(response.body).value
          };
          result.value.forEach((e: EpidemicPerson) => {
            e.submitTime = moment(e.submitTime).format('YYYY-MM-DD HH:mm:ss');
            e.diseaseTime = moment(e.diseaseTime).format('YYYY-MM-DD HH:mm:ss');
          });
          return result;
        })
        .catch((error: any) => {})
    );
  },

  /**
   * 获取省疫情数据
   */
  queryProvinceEpidemicData() {
    const url = store.getters.configs.ncovUrl + `common/runtime_patient_area?areaCode=420000`;
    return httpClient.getPromise(url);
  },

  /**
   * 获取省下市疫情数据
   */
  queryCityEpidemicData() {
    const url = store.getters.configs.ncovUrl + `common/runtime_patient_area_list?parentNo=420000`;
    return httpClient.getPromise(url);
  }
};
