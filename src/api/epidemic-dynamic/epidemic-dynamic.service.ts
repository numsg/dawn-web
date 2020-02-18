import transformToColor from './../../common/filters/colorformat';
import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import EpidemicPerson from '@/models/home/epidemic-persion';
import odataClient from '@gsafety/odata-client/dist';
import moment from 'moment';
import mapperManagerService from '@/common/odata/mapper-manager.service';
import SessionStorage from '@/utils/session-storage';
import { isJsonString } from '@gsafety/whatever/dist/util';

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
   * 更新人员就医情况
   *
   * @param {EpidemicPerson} epidemicPerson 重点关注人员信息
   * @param {string} medicalSituation 待变更的就医情况
   * @returns
   */
  updatePersonMedicalSituation(epidemicPerson: EpidemicPerson, medicalSituation: string) {
    const url = store.getters.configs.communityManagerUrl + `epidemic-person/medical-treatment`;
    const user: any = sessionStorage.getItem('userInfo');
    const updateInfo = {
      id: epidemicPerson.id,
      medicalTreatmentId: medicalSituation,
      operator: isJsonString(user) ? JSON.parse(user).id : user ? user.id : ''
    };
    return httpClient.putPromise(url, updateInfo);
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
      service: store.getters.configs.communityManagerOdataUrl,
      resources: 'EpidemicPersonEntity'
    });
    let filterStr = '';
    if (conditions.keywords && conditions.keywords !== '') {
      // tslint:disable-next-line:quotemark
      filterStr += "contains( name, '" + conditions.keywords + "') or contains( mobileNumber, '" + conditions.keywords + "')";
    }
    if (conditions.diagnosisIds && conditions.diagnosisIds.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.diagnosisIds.length - 1; i < conditions.diagnosisIds.length; i++) {
        const id = conditions.diagnosisIds[i];
        if (i !== len) {
          // tslint:disable-next-line:quotemark
          str += "(diagnosisSituation eq '" + id + "') or ";
        } else {
          // tslint:disable-next-line:quotemark
          str = '(' + str + "(diagnosisSituation eq '" + id + "')" + ')';
          if (filterStr) {
            filterStr = filterStr + ' and ' + str;
          } else {
            filterStr += str;
          }
        }
      }
    }
    if (conditions.villageIds && conditions.villageIds.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.villageIds.length - 1; i < conditions.villageIds.length; i++) {
        const id = conditions.villageIds[i];
        if (i !== len) {
          // tslint:disable-next-line:quotemark
          str += "(villageId eq '" + id + "') or ";
        } else {
          // tslint:disable-next-line:quotemark
          str = '(' + str + "(villageId eq '" + id + "')" + ')';
          if (filterStr) {
            filterStr = filterStr + ' and ' + str;
          } else {
            filterStr += str;
          }
        }
      }
    }
    if (conditions.confirmedDiagnosis && conditions.confirmedDiagnosis.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.confirmedDiagnosis.length - 1; i < conditions.confirmedDiagnosis.length; i++) {
        const id = conditions.confirmedDiagnosis[i];
        if (i !== len) {
          // tslint:disable-next-line:quotemark
          str += "(confirmedDiagnosis eq '" + id + "') or ";
        } else {
          // tslint:disable-next-line:quotemark
          str = '(' + str + "(confirmedDiagnosis eq '" + id + "')" + ')';
          if (filterStr) {
            filterStr = filterStr + ' and ' + str;
          } else {
            filterStr += str;
          }
        }
      }
    }
    if (conditions.medicalCondition && conditions.medicalCondition.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.medicalCondition.length - 1; i < conditions.medicalCondition.length; i++) {
        const id = conditions.medicalCondition[i];
        if (i !== len) {
          // tslint:disable-next-line:quotemark
          str += "(medicalCondition eq '" + id + "') or ";
        } else {
          // tslint:disable-next-line:quotemark
          str = '(' + str + "(medicalCondition eq '" + id + "')" + ')';
          if (filterStr) {
            filterStr = filterStr + ' and ' + str;
          } else {
            filterStr += str;
          }
        }
      }
    }
    const oorder = {
      type: conditions.sort ? conditions.sort.type : 'submitTime',
      flag: conditions.sort ? conditions.sort.flag : 'desc'
    };
    const multiTenancy = SessionStorage.get('district');
    if (filterStr) {
      // tslint:disable-next-line:quotemark
      filterStr = filterStr + " and (multiTenancy eq '" + multiTenancy + "')";
    } else {
      // tslint:disable-next-line:quotemark
      filterStr = "(multiTenancy eq '" + multiTenancy + "')";
    }
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
        const medicalOpinions: any[] = store.getters.baseData_medicalOpinions;
        ep.communityModel = communities.find(k => k.id === ep.villageId) || {};
        ep.diagnosisSituationModel = diagnosisSituations.find(k => k.id === ep.diagnosisSituation) || {};
        if (ep.diagnosisSituationModel && ep.diagnosisSituationModel.name && !ep.diagnosisSituationModel.imageColor) {
          ep.diagnosisSituationModel.imageColor = transformToColor(ep.diagnosisSituationModel.name);
        }
        ep.medicalOpinionModel = medicalOpinions.find(k => k.id === ep.confirmedDiagnosis) || {};
        ep.medicalConditionModel = medicalSituations.find(k => k.id === ep.medicalCondition) || {};
        ep.specialSituationModel = specialSituations.find(k => k.id === ep.specialSituation) || {};
        ep.genderModel = genderClassification.find(k => k.id === ep.gender) || {};
        res.push(ep);
      });
    }
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
  getEpidemicStaticalData(dimension: string) {
    const multiTenancy = SessionStorage.get('district');
    // const url = store.getters.configs.communityManagerUrl + `epidemic-person/total/all/${multiTenancy}`;
    let conditionUrl = '';
    let apiUrl = '';
    if (dimension === '1') {
      conditionUrl = store.getters.configs.medicalOpinionsId;
      apiUrl = `epidemic-person/overall-classification/${multiTenancy}/${conditionUrl}`;
    } else if (dimension === '2') {
      conditionUrl = store.getters.configs.medicalConditionDataSourceId;
      apiUrl = `epidemic-person/overall-medical/${multiTenancy}/${conditionUrl}`;
    } else {
      conditionUrl = store.getters.configs.medicalOpinionsId;
      apiUrl = `epidemic-person/overall-classification/${multiTenancy}/${conditionUrl}`;
    }
    const url = store.getters.configs.communityManagerUrl + apiUrl;
    return httpClient.getPromise(url);
  }
};
