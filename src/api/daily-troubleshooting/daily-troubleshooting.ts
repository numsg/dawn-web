import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import odataClient from '@gsafety/odata-client/dist';

import { PersonInfo } from '@/models/daily-troubleshooting/person-info';
import { eqBy } from 'ramda';

export default {
    // 新增填报记录
    addDailyTroubleshooting(info: PersonInfo) {
        const url = store.getters.configs.baseSupportUrl + 'daily-troubleshoot-record';
        return httpClient
        .postPromise(url, info)
        .then(res => {
            return res;
        })
        .catch(err => {
            return false;
        });
    },
    // 通过导入新增文件
    addDailyTroubleshootingByxlsx(info: any) {
      const url = store.getters.configs.baseSupportUrl + 'daily-troubleshoot-record/import';
        return httpClient
        .postPromise(url, info, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return false;
        });
    },
    // 查询所有日常排查记录
    queryAllDailyRecord(page: number, count: number, keyowrds?: string) {
      const q = odataClient({
        service: store.getters.configs.communityManagerOdataUrl,
        resources: 'DailyTroubleshootRecordEntity'
      });
      if (keyowrds) {
        // tslint:disable-next-line:max-line-length
        const filterStr = 'contains( name, \'' + keyowrds + '\') or contains( address, \'' + keyowrds + '\') or  contains( medicalCondition, \'' + keyowrds + '\')';
        return q
          .skip(count * page)
          .top(count)
          .filter(filterStr)
          .orderby('createTime', 'desc')
          .count(true)
          .get(null)
          .then((response: any) => {
            console.log(response.body);
            const result = {
              count: JSON.parse(response.body)['@odata.count'],
              value: this.buildDailyRecord(JSON.parse(response.toJSON().body).value)
            };
            return result;
          })
          .catch((error: any) => {});
      } else {
        return q
          .skip(count * page)
          .top(count)
          .orderby('createTime', 'desc')
          .count(true)
          .get(null)
          .then((response: any) => {
            console.log(response.body);
            const result = {
              count: JSON.parse(response.body)['@odata.count'],
              value: this.buildDailyRecord(JSON.parse(response.toJSON().body).value)
            };
            return result;
          })
          .catch((error: any) => {});
      }
    },
    buildDailyRecord(result: any[]) {
      const res: any[] = [];
      // if (Array.isArray(result) && result.length > 0) {
      //   result.forEach((data: any) => {
      //     const ep = new PersonInfo();
      //     eq = moment(data.submitTime).format('YYYY-MM-DD HH:mm:ss');
      //     ep.diseaseTime = moment(data.diseaseTime).format('YYYY-MM-DD HH:mm:ss');
      //     ep.updateTime = moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss');
      //     const communities: any[] = store.getters.baseData_communities;
      //     const diagnosisSituations: any[] = store.getters.baseData_diagnosisSituations;
      //     const medicalSituations: any[] = store.getters.baseData_medicalSituations;
      //     const specialSituations: any[] = store.getters.baseData_specialSituations;
      //     const genderClassification: any[] = store.getters.baseData_genderClassification;
      //     ep.communityModel = communities.find(k => k.id === ep.villageId) || {};
      //     ep.diagnosisSituationModel = diagnosisSituations.find(k => k.id === ep.diagnosisSituation) || {};
      //     ep.medicalConditionModel = medicalSituations.find(k => k.id === ep.medicalCondition) || {};
      //     ep.specialSituationModel = specialSituations.find(k => k.id === ep.specialSituation) || {};
      //     ep.genderModel = genderClassification.find(k => k.id === ep.gender) || {};
      //     res.push(ep);
      //   });
      // }
      console.log('---buildDailyRecord---');
      console.log(result);
      return result;
    },

  queryAttachments(businessId: any): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.odataUrl,
      resources: 'AttachmentEntity'
    });
    return q
      .filter('businessId', '=', businessId)
      .get()
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        return false;
      });
  },

  removeRelation(fileId: any) {
    const url = store.getters.configs.planPreparationUrl + 'attachments/' + fileId;
    return httpClient
      .deletePromise(url)
      .then(res => {
        return res;
      })
      .catch(err => {
        return false;
      });
  }
};
