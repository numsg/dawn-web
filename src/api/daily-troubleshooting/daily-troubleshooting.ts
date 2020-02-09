import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import odataClient from '@gsafety/odata-client/dist';

import { PersonInfo } from '@/models/daily-troubleshooting/person-info';
import { PersonOdataInfo } from '@/models/daily-troubleshooting/person-odata-info';
import { eqBy } from 'ramda';
import moment from 'moment';
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
    // 修改填报记录
    editDailyTroubleshooting(info: PersonInfo) {
      const url = store.getters.configs.baseSupportUrl + 'daily-troubleshoot-record';
        return httpClient
        .putPromise(url, info)
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
    queryAllDailyRecord(page: number, count: number, keyowrds?: string, ids?: string[]) {
      const q = odataClient({
        service: store.getters.configs.communityManagerOdataUrl,
        resources: 'DailyTroubleshootRecordEntity'
      });
      let filterStr = '';
      if (keyowrds) {
        const keywordList = keyowrds.split('-');
        let building = '';
        let unitNumber = '';
        let roomNo = '';
        if ( keywordList.length > 0 ) {
          building =  keywordList[0];
          filterStr += 'contains( building, \'' + building + '\')';
        }
        if ( keywordList.length > 1 ) {
          unitNumber =  keywordList[1];
          filterStr += ' and contains( unitNumber, \'' + unitNumber + '\')';
        }
        if ( keywordList.length > 2 ) {
          roomNo =  keywordList[2];
          filterStr += ' and contains( roomNo, \'' + roomNo + '\')';
        }
      }
      if (ids && ids.length > 0) {
        let str = '';
        for (let i = 0, len = ids.length - 1; i < ids.length; i++) {
            const id = ids[i];
            if (i !== len) {
                str += '(plot eq \'' + id + '\') or ';
            } else {
                str = '(' + str + '(plot eq \'' + id + '\')' + ')';
                if (filterStr) {
                  filterStr = filterStr + ' and ' + str;
                } else {
                  filterStr += str;
                }
            }
        }
      }
      const startTime = moment().startOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      const endTime = moment().endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      if (filterStr) {
        filterStr = '(createTime gt ' + startTime + ') and '
                  + '(createTime lt ' + endTime + ') and ' + filterStr;
      } else {
        filterStr = '(createTime gt ' + startTime + ') and '
                  + '(createTime lt ' + endTime + ')';
      }
      if (filterStr) {
        return q
          .skip(count * (page - 1 ))
          .top(count)
          .filter(filterStr)
          .orderby('building', 'asc')
          .orderby('unitNumber', 'asc')
          .orderby('roomNo', 'asc')
          .orderby('createTime', 'asc')
          .count(true)
          .get(null)
          .then((response: any) => {
            const result = {
              count: JSON.parse(response.body)['@odata.count'],
              value: this.buildDailyRecord(JSON.parse(response.toJSON().body).value)
            };
            return result;
          })
          .catch((error: any) => {});
      } else {
        return q
          .skip(count * (page - 1 ))
          .top(count)
          .orderby('building', 'asc')
          .orderby('unitNumber', 'asc')
          .orderby('roomNo', 'asc')
          .orderby('createTime', 'asc')
          .count(true)
          .get(null)
          .then((response: any) => {
            const result = {
              count: JSON.parse(response.body)['@odata.count'],
              value: this.buildDailyRecord(JSON.parse(response.toJSON().body).value)
            };
            return result;
          })
          .catch((error: any) => {});
      }
    },
    queryExportExcel(keyowrds?: string, plots?: string[]) {
      const q = odataClient({
        service: store.getters.configs.communityManagerOdataUrl,
        resources: 'DailyTroubleshootRecordEntity'
      });
      let filterStr = '';
      if (keyowrds) {
        const keywordList = keyowrds.split('-');
        let building = '';
        let unitNumber = '';
        let roomNo = '';
        if ( keywordList.length > 0 ) {
          building =  keywordList[0];
          filterStr += 'contains( building, \'' + building + '\')';
        }
        if ( keywordList.length > 1 ) {
          unitNumber =  keywordList[1];
          filterStr += ' and contains( unitNumber, \'' + unitNumber + '\')';
        }
        if ( keywordList.length > 2 ) {
          roomNo =  keywordList[2];
          filterStr += ' and contains( roomNo, \'' + roomNo + '\')';
        }
      }
      if (plots && plots.length > 0) {
        let str = '';
        for (let i = 0, len = plots.length - 1; i < plots.length; i++) {
            const id = plots[i];
            if (i !== len) {
                str += '(plot eq \'' + id + '\') or ';
            } else {
                str = '(' + str + '(plot eq \'' + id + '\')' + ')';
                if (filterStr) {
                  filterStr = filterStr + ' and ' + str;
                } else {
                  filterStr += str;
                }
            }
        }
      }
      const startTime = moment().startOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      const endTime = moment().endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      if (filterStr) {
        filterStr = '(createTime gt ' + startTime + ') and '
                  + '(createTime lt ' + endTime + ') and ' + filterStr;
      } else {
        filterStr = '(createTime gt ' + startTime + ') and '
                  + '(createTime lt ' + endTime + ')';
      }
      return q
        .skip(0)
        // .top(10000)
        .orderby('building', 'asc')
        .orderby('unitNumber', 'asc')
        .orderby('roomNo', 'asc')
        .orderby('createTime', 'asc')
        .filter(filterStr)
        .count(true)
        .get(null)
        .then((response: any) => {
          const result = {
            count: JSON.parse(response.body)['@odata.count'],
            value: this.buildDailyRecord(JSON.parse(response.toJSON().body).value)
          };
          return result;
        })
        .catch((error: any) => {});
    },
    buildDailyRecord(result: any[]) {
      const res: any[] = [];
      if (Array.isArray(result) && result.length > 0) {
        result.forEach((data: PersonOdataInfo) => {
          const item = new PersonInfo();
          item.id = data.id;
          item.name = data.name;
          item.address = data.address;
          item.age = data.age;
          item.building = data.building;
          item.code = data.code;
          item.confirmed_diagnosis = data.confirmed_diagnosis;
          item.createTime = data.createTime;
          item.identificationNumber = data.identificationNumber;
          item.contact = data.isExceedTemp;
          item.exceedTemp = data.isExceedTemp;
          // item.leaveArea = data.isLeaveArea;
          item.medicalOpinion = data.medicalOpinion;
          item.multiTenancy = data.multiTenancy;
          item.note = data.note;
          item.otherSymptoms = data.otherSymptoms;
          item.phone = data.phone;
          item.plot = data.plot;
          item.roomNo = data.roomNo;
          item.sex = data.sex;
          item.unitNumber = data.unitNumber;
          res.push(item);
        });
      }
      return res;
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
  queryCommunity() {
    const id = store.getters.configs.communityDataSourceId;
    const q = odataClient({
      service: store.getters.configs.communityManagerOdataUrl,
      resources: 'DataSourceEntity',
      format: 'json'
      });
    return q
      .filter('id', 'eq', id)
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
  },

  getStatisticsData() {
    const url = store.getters.configs.communityManagerUrl + 'daily-troubleshoot-record/statistics';
    return httpClient
      .getPromise(url)
      .then(res => {
        return res;
      })
      .catch(err => {
        return false;
      });
  }

};
