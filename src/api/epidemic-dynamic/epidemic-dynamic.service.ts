import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import { treeToArray } from '@/common/utils/utils';
import mapperManager from '@/common/odata/mapper-manager.service';
import EpidemicPerson from '@/models/home/epidemic-persion';
import odataClient from '@gsafety/odata-client/dist';
import moment from 'moment';
import mapperManagerService from '@/common/odata/mapper-manager.service';

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
   * 编辑人员
   * @param epidemicPerson
   */
  editEpidemicPerson(epidemicPerson: EpidemicPerson) {
    const url = store.getters.configs.communityManagerUrl + `epidemic-person/${epidemicPerson.id}`;
    return httpClient.putPromise(url, epidemicPerson);
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
  queryEpidemicPersons(conditions: any) {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'EpidemicPersonEntity'
    });
    let filterStr = '';
    if (conditions.keyowrds) {
      filterStr += 'contains( name, \'' + conditions.keyowrds + '\') or contains( mobileNumber, \'' + conditions.keyowrds + '\')';

    }
    if (conditions.diagnosisIds && conditions.diagnosisIds.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.diagnosisIds.length - 1; i < conditions.diagnosisIds.length; i++) {
          const id = conditions.diagnosisIds[i];
          if (i !== len) {
              str += '(diagnosisSituation eq \'' + id + '\') or ';
          } else {
              str = '(' + str + '(diagnosisSituation eq \'' + id + '\')' + ')';
              filterStr += str;
          }
      }
    }
    const oorder = {
      type: conditions.sort ? conditions.sort.type : 'submitTime',
      flag: conditions.sort ? conditions.sort.flag : 'desc'
    };
    if (filterStr) {
      return q
        .skip(conditions.count * conditions.page)
        .top(conditions.count)
        .filter(filterStr)
        .orderby(oorder.type, oorder.flag)
        .count(true)
        .get(null)
        .then((response: any) => {
          const result = {
            count: JSON.parse(response.body)['@odata.count'],
            value: this.buildEpidemicPersons(JSON.parse(response.toJSON().body).value)
          };
          return result;
        })
        .catch((error: any) => {});
    } else {
      return q
        .skip(conditions.count * conditions.page)
        .top(conditions.count)
        .orderby(oorder.type, oorder.flag)
        .count(true)
        .get(null)
        .then((response: any) => {
          const result = {
            count: JSON.parse(response.body)['@odata.count'],
            value: this.buildEpidemicPersons(JSON.parse(response.toJSON().body).value)
          };
          return result;
        })
        .catch((error: any) => {});
    }
  },

  buildEpidemicPersons(result: any[]) {
    const res: any[] = [];
    if (Array.isArray(result) && result.length > 0) {
      result.forEach((data: any) => {
        const ep = new EpidemicPerson();
        Object.assign(ep, data);
        ep.submitTime = moment(data.submitTime).format('YYYY-MM-DD HH:mm:ss');
        ep.diseaseTime = moment(data.diseaseTime).format('YYYY-MM-DD HH:mm:ss');
        ep.updateTime = moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss');
        const communities: any[] = store.getters.baseData_communities;
        const diagnosisSituations: any[] = store.getters.baseData_diagnosisSituations;
        const medicalSituations: any[] = store.getters.baseData_medicalSituations;
        const specialSituations: any[] = store.getters.baseData_specialSituations;
        const genderClassification: any[] = store.getters.baseData_genderClassification;
        ep.communityModel = communities.find(k => k.id === ep.villageId) || {};
        ep.diagnosisSituationModel = diagnosisSituations.find(k => k.id === ep.diagnosisSituation) || {};
        ep.medicalConditionModel = medicalSituations.find(k => k.id === ep.medicalCondition) || {};
        ep.specialSituationModel = specialSituations.find(k => k.id === ep.specialSituation) || {};
        ep.genderModel = genderClassification.find(k => k.id === ep.gender) || {};
        res.push(ep);
      });
    }
    console.log('---buildEpidemicPersons---');
    console.log(res);
    return res;
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
  },

  /**
   * 获取统计数据
   */
  getEpidemicStaticalData() {
    const url = store.getters.configs.communityManagerUrl + `epidemic-person/total/all`;
    return httpClient.getPromise(url);
  }

};
