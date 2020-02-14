import TroubleshootRecord from '@/models/daily-troubleshooting/trouble-shoot-record';
import { DailyQueryConditions } from '@/models/common/daily-query-conditions';
import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import odataClient from '@gsafety/odata-client/dist';

import { PersonInfo } from '@/models/daily-troubleshooting/person-info';
import { PersonOdataInfo } from '@/models/daily-troubleshooting/person-odata-info';
import { eqBy, cond } from 'ramda';
import moment from 'moment';
import SessionStorage from '@/utils/session-storage';
import communityQrManageService from '../community-qr-manage/community-qr-manage.service';
import dataSourceService from '@/api/data-source/data-source.service';

export default {
    // 新增填报记录
    addDailyTroubleshooting(info: PersonInfo) {
        const url = store.getters.configs.communityManagerUrl + 'daily-troubleshoot-record';
        return httpClient
        .postPromise(url, info)
        .then(res => {
            return res;
        })
        .catch(err => {
            return false;
        });
    },

    addTroubleshootingRecord(record: TroubleshootRecord) {
      const url = store.getters.configs.communityManagerUrl + 'add';
      return httpClient
      .postPromise(url, record)
      .then(res => {
          return res;
      })
      .catch(err => {
          return false;
      });
  },

    // 修改填报记录
    editDailyTroubleshooting(info: PersonInfo) {
      const url = store.getters.configs.communityManagerUrl + 'daily-troubleshoot-record';
        return httpClient
        .putPromise(url, info)
        .then(res => {
            return res;
        })
        .catch(err => {
            return false;
        });
    },

     // 修改填报记录
     updateTroubleshootingRecord(record: TroubleshootRecord) {
      const url = store.getters.configs.communityManagerUrl + 'update';
        return httpClient
        .putPromise(url, record)
        .then(res => {
            return res;
        })
        .catch(err => {
            return false;
        });
    },

    // 通过导入新增文件
    addDailyTroubleshootingByxlsx(info: any) {
      const url = store.getters.configs.communityManagerUrl + 'daily-troubleshoot-record/import';
        return httpClient
        .postPromise(url, info, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return false;
        });
    },

    // 江夏特定查询接口
    queryDailyRecordByTime(param: any) {
      const url = store.getters.configs.baseSupportUrl + 'daily-troubleshoot-record/import';
        return httpClient
        .postPromise(url, param)
        .then(res => {
            return res;
        })
        .catch(err => {
            return false;
        });
    },

     // 查询所有日常排查记录
     queryTroubleshootingRecords(conditions: DailyQueryConditions) {
      const q = odataClient({
        service: store.getters.configs.communityManagerOdataUrl,
        resources: 'TroubleshootRecordEntity'
      });
      let filterStr = '';
      if (conditions.keyWord) {
        // tslint:disable-next-line:max-line-length
        filterStr += 'contains( personBase/name, \'' + conditions.keyWord + '\') or contains( personBase/address, \'' + conditions.keyWord + '\') or contains( personBase/phone, \'' + conditions.keyWord + '\')';
        const keywordList = conditions.keyWord.split('-');
        let building = '';
        let unitNumber = '';
        let roomNo = '';
        let bstr = '';
        if ( keywordList.length > 0 ) {
          building =  keywordList[0];
          bstr += 'contains( building, \'' + building + '\')';
        }
        if ( keywordList.length > 1 ) {
          unitNumber =  keywordList[1];
          bstr += ' and contains( unitNumber, \'' + unitNumber + '\')';
        }
        if ( keywordList.length > 2 ) {
          roomNo =  keywordList[2];
          bstr += ' and contains( roomNo, \'' + roomNo + '\')';
        }
        if (bstr) {
          filterStr = '(' + filterStr + ' or ' + bstr + ')';
        }
      }
      if (conditions.plots && conditions.plots.length > 0) {
        let str = '';
        for (let i = 0, len = conditions.plots.length - 1; i < conditions.plots.length; i++) {
            const id = conditions.plots[i];
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

      if (conditions.medicalOpinion && conditions.medicalOpinion.length > 0) {
        let str = '';
        for (let i = 0, len = conditions.medicalOpinion.length - 1; i < conditions.medicalOpinion.length; i++) {
            const id = conditions.medicalOpinion[i];
            if (i !== len) {
                str += '(medicalOpinion eq \'' + id + '\') or ';
            } else {
                str = '(' + str + '(medicalOpinion eq \'' + id + '\')' + ')';
                if (filterStr) {
                  filterStr = filterStr + ' and ' + str;
                } else {
                  filterStr += str;
                }
            }
        }
      }

      if (conditions.isFaver && conditions.isFaver.length > 0) {
        let str = '';
        for (let i = 0, len = conditions.isFaver.length - 1; i < conditions.isFaver.length; i++) {
            const value = conditions.isFaver[i];
            if (i !== len) {
                str += '(isExceedTemp eq ' + value + ') or ';
            } else {
                str = '(' + str + '(isExceedTemp eq ' + value + ')' + ')';
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
      let cstr = '';
      if (conditions.isChecked) {
        cstr = '(createTime gt ' + startTime + ') and ' + '(createTime lt ' + endTime + ')';
      } else {
        cstr = '(createTime lt ' + startTime + ')';
      }
      if (filterStr) {
        filterStr = cstr + ' and ' + filterStr;
      } else {
        filterStr = cstr;
      }
      const multiTenancy = SessionStorage.get('district');
      filterStr += ' and (multiTenancy eq \'' + multiTenancy + '\')';
      if (filterStr) {
        return q
          .skip(conditions.pageSize * (conditions.page))
          .top(conditions.pageSize)
          .expand('personBase')
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
              value: this.buildTroubleshootingRecord(JSON.parse(response.toJSON().body).value)
            };
            return result;
          })
          .catch((error: any) => {});
      } else {
        return q
          .skip(conditions.pageSize * (conditions.page))
          .top(conditions.pageSize)
          .expand('personBase')
          .orderby('building', 'asc')
          .orderby('unitNumber', 'asc')
          .orderby('roomNo', 'asc')
          .orderby('createTime', 'asc')
          .count(true)
          .get(null)
          .then((response: any) => {
            console.log(response);
            const result = {
              count: JSON.parse(response.body)['@odata.count'],
              value: this.buildTroubleshootingRecord(JSON.parse(response.toJSON().body).value)
            };
            return result;
          })
          .catch((error: any) => {});
      }
    },

    buildTroubleshootingRecord(result: any) {
      const res: any[] = [];
      if (Array.isArray(result) && result.length > 0) {
        return result;
      }
      return res;
    },

    // 查询所有日常排查记录
    loadExportExcel(conditions: DailyQueryConditions) {
      const q = odataClient({
        service: store.getters.configs.communityManagerOdataUrl,
        resources: 'TroubleshootRecordEntity'
      });
      let filterStr = '';
      if (conditions.keyWord) {
        filterStr += 'contains( personBase/name, \'' + conditions.keyWord + '\') or contains( personBase/address, \'' + conditions.keyWord + '\') or contains( personBase/phone, \'' + conditions.keyWord + '\')';
        const keywordList = conditions.keyWord.split('-');
        let building = '';
        let unitNumber = '';
        let roomNo = '';
        let bstr = '';
        if ( keywordList.length > 0 ) {
          building =  keywordList[0];
          bstr += 'contains( building, \'' + building + '\')';
        }
        if ( keywordList.length > 1 ) {
          unitNumber =  keywordList[1];
          bstr += ' and contains( unitNumber, \'' + unitNumber + '\')';
        }
        if ( keywordList.length > 2 ) {
          roomNo =  keywordList[2];
          bstr += ' and contains( roomNo, \'' + roomNo + '\')';
        }
        if (bstr) {
          filterStr = '(' + filterStr + ' or ' + bstr + ')';
        }
      }
      if (conditions.plots && conditions.plots.length > 0) {
        let str = '';
        for (let i = 0, len = conditions.plots.length - 1; i < conditions.plots.length; i++) {
            const id = conditions.plots[i];
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

      if (conditions.medicalOpinion && conditions.medicalOpinion.length > 0) {
        let str = '';
        for (let i = 0, len = conditions.medicalOpinion.length - 1; i < conditions.medicalOpinion.length; i++) {
            const id = conditions.medicalOpinion[i];
            if (i !== len) {
                str += '(medicalOpinion eq \'' + id + '\') or ';
            } else {
                str = '(' + str + '(medicalOpinion eq \'' + id + '\')' + ')';
                if (filterStr) {
                  filterStr = filterStr + ' and ' + str;
                } else {
                  filterStr += str;
                }
            }
        }
      }

      if (conditions.isFaver && conditions.isFaver.length > 0) {
        let str = '';
        for (let i = 0, len = conditions.isFaver.length - 1; i < conditions.isFaver.length; i++) {
            const value = conditions.isFaver[i];
            if (i !== len) {
                str += '(isExceedTemp eq ' + value + ') or ';
            } else {
                str = '(' + str + '(isExceedTemp eq ' + value + ')' + ')';
                if (filterStr) {
                  filterStr = filterStr + ' and ' + str;
                } else {
                  filterStr += str;
                }
            }
        }
      }
      // 分组  isShowgGroup
      if ( conditions.isGroup ) {
        // 打开组选框, 通过分组筛选 根据小区, 楼栋, 单元 的字段来筛选
          if ( conditions.checkedPlot ) {
              const buildingStr = '( plot eq \'' + conditions.checkedPlot + '\')  ';
              if ( filterStr ) {
                filterStr = filterStr + ' and ' + buildingStr;
              } else {
                filterStr += buildingStr;
              }
          }
          if ( conditions.checkedBuilding ) {
            // 待改 (plot eq \'' + id + '\')
            const buildingStr = '( building eq \'' + conditions.checkedBuilding + '\')';
            if ( filterStr ) {
              filterStr = filterStr + ' and ' + buildingStr;
            } else {
              filterStr += buildingStr;
            }
          }
          if ( conditions.checkedUnitNumber ) {
            const unitNumberStr = '( unitNumber eq \'' + conditions.checkedUnitNumber + '\')';
            if ( filterStr ) {
              filterStr = filterStr + ' and ' + unitNumberStr;
            } else {
              filterStr += unitNumberStr;
            }
          }
      }
      // 不分组  isShowgGroup  查询所有 不加条件

      // 不排查  ???

      // 排查
      const startTime = moment().startOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      const endTime = moment().endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
      if ( conditions.isChecked ) {
        const str = '(createTime gt ' + startTime + ') and ' + '(createTime lt ' + endTime + ')';
        if ( filterStr ) {
          filterStr = filterStr + ' and ' + str;
        } else {
          filterStr += str;
        }
      } else {
        const str = '(createTime lt ' + startTime + ')';
        if ( filterStr ) {
          filterStr = filterStr + ' and ' + str;
        } else {
          filterStr += str;
        }
      }
      const multiTenancy = SessionStorage.get('district');
      filterStr += ' and (multiTenancy eq \'' + multiTenancy + '\')';
      if (filterStr) {
        return q
          .skip(0)
          .expand('personBase')
          .filter(filterStr)
          .orderby('building', 'asc')
          .orderby('unitNumber', 'asc')
          .orderby('roomNo', 'asc')
          .orderby('createTime', 'asc')
          .count(true)
          .get(null)
          .then((response: any) => {
            return this.buildTroubleshootingRecord(JSON.parse(response.toJSON().body).value);
          })
          .catch((error: any) => {});
      } else {
        return q
          .skip(0)
          .expand('personBase')
          .orderby('building', 'asc')
          .orderby('unitNumber', 'asc')
          .orderby('roomNo', 'asc')
          .orderby('createTime', 'esc')
          .count(true)
          .get(null)
          .then((response: any) => {
            return this.buildTroubleshootingRecord(JSON.parse(response.toJSON().body).value);
          })
          .catch((error: any) => {});
      }
    },

    // 江夏特定排查记录
    loadExportByJXExcel(info: any) {
      const url = store.getters.configs.communityManagerUrl + 'timer/data';
      return httpClient
        .postPromise(url, info)
        .then(res => {
          return res;
        })
        .catch(err => {
          return false;
        });
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
  async queryCommunity() {
    const  dataSourceId = await dataSourceService.getCommunityDataSourceId();
    const q = odataClient({
      service: store.getters.configs.communityManagerOdataUrl,
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
  },

  getRecordStatistics() {
    const multiTenancy = SessionStorage.get('district');
    const url = store.getters.configs.communityManagerUrl + `plot-reporting-staff/${multiTenancy}/multiTenancy`;
    return httpClient
      .getPromise(url)
      .then(res => {
        return res;
      })
      .catch(err => {
        return false;
      });
  },

  getStatistics(conditions: DailyQueryConditions) {
    const q = odataClient({
      service: store.getters.configs.communityManagerOdataUrl,
      resources: 'TroubleshootRecordEntity'
    });
    let filterStr = '';
    if (conditions.keyWord) {
      // tslint:disable-next-line:max-line-length
      filterStr += 'contains( personBase/name, \'' + conditions.keyWord + '\') or contains( personBase/address, \'' + conditions.keyWord + '\') or contains( personBase/phone, \'' + conditions.keyWord + '\')';
      const keywordList = conditions.keyWord.split('-');
      let building = '';
      let unitNumber = '';
      let roomNo = '';
      let bstr = '';
      if ( keywordList.length > 0 ) {
        building =  keywordList[0];
        bstr += 'contains( building, \'' + building + '\')';
      }
      if ( keywordList.length > 1 ) {
        unitNumber =  keywordList[1];
        bstr += ' and contains( unitNumber, \'' + unitNumber + '\')';
      }
      if ( keywordList.length > 2 ) {
        roomNo =  keywordList[2];
        bstr += ' and contains( roomNo, \'' + roomNo + '\')';
      }
      if (bstr) {
        filterStr = '(' + filterStr + ' or ' + bstr + ')';
      }
    }
    if (conditions.plots && conditions.plots.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.plots.length - 1; i < conditions.plots.length; i++) {
          const id = conditions.plots[i];
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

    if (conditions.medicalOpinion && conditions.medicalOpinion.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.medicalOpinion.length - 1; i < conditions.medicalOpinion.length; i++) {
          const id = conditions.medicalOpinion[i];
          if (i !== len) {
              str += '(medicalOpinion eq \'' + id + '\') or ';
          } else {
              str = '(' + str + '(medicalOpinion eq \'' + id + '\')' + ')';
              if (filterStr) {
                filterStr = filterStr + ' and ' + str;
              } else {
                filterStr += str;
              }
          }
      }
    }

    if (conditions.isFaver && conditions.isFaver.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.isFaver.length - 1; i < conditions.isFaver.length; i++) {
          const value = conditions.isFaver[i];
          if (i !== len) {
              str += '(isExceedTemp eq ' + value + ') or ';
          } else {
              str = '(' + str + '(isExceedTemp eq ' + value + ')' + ')';
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
    let cstr = '';
    if (conditions.isChecked) {
      cstr = '(createTime gt ' + startTime + ') and ' + '(createTime lt ' + endTime + ')';
    } else {
      cstr = '(createTime lt ' + startTime + ')';
    }
    if (filterStr) {
      filterStr = cstr + ' and ' + filterStr;
    } else {
      filterStr = cstr;
    }
    const multiTenancy = SessionStorage.get('district');
    filterStr += ' and (multiTenancy eq \'' + multiTenancy + '\')';
      return q
        .skip(0)
        .filter(filterStr)
        .select('plot')
        .get(null)
        .then((response: any) => {
            return this.buildTroubleshootingRecord(JSON.parse(response.toJSON().body).value);
        })
        .catch((error: any) => {});
  },

    /**
   * 获取人员分组数据
   */
  queryGroupsData() {
    const multiTenancy = SessionStorage.get('district');
    const url = store.getters.configs.communityManagerUrl + `plot-building-unit-staff/${multiTenancy}/multiTenancy`;
    return httpClient
      .getPromise(url)
      .then(res => {
        return res;
      })
      .catch(err => {
        return false;
      });
  },

   /**
   * 获取人员分组数据
   */
  getGroupPersonData(conditions: DailyQueryConditions) {
    console.log(conditions);
    const q = odataClient({
      service: store.getters.configs.communityManagerOdataUrl,
      resources: 'TroubleshootRecordEntity'
    });
    let filterStr = '';
    if (conditions.plots && conditions.plots.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.plots.length - 1; i < conditions.plots.length; i++) {
          const id = conditions.plots[i];
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
    if (filterStr) {
      filterStr = '(plot eq \'' + conditions.dailyStatisticModel.plotId + '\') and ' +
      '(building eq \'' + conditions.dailyStatisticModel.building + '\') and ' +
      '(unitNumber eq \'' + conditions.dailyStatisticModel.unitNumber + '\') and ' + filterStr;
    } else {
      filterStr = '(plot eq \'' + conditions.dailyStatisticModel.plotId + '\') and ' +
      '(building eq \'' + conditions.dailyStatisticModel.building + '\') and ' +
      '(unitNumber eq \'' + conditions.dailyStatisticModel.unitNumber + '\')';
    }
    const startTime = moment().startOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    const endTime = moment().endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    let cstr = '';
    if (conditions.isChecked) {
      cstr = '(createTime gt ' + startTime + ') and ' + '(createTime lt ' + endTime + ')';
    } else {
      cstr = '(createTime lt ' + startTime + ')';
    }
    if (filterStr) {
      filterStr = cstr + ' and ' + filterStr;
    } else {
      filterStr = cstr;
    }
    const multiTenancy = SessionStorage.get('district');
    filterStr += ' and (multiTenancy eq \'' + multiTenancy + '\')';

    return q
    .skip(conditions.pageSize * (conditions.page))
    .top(conditions.pageSize)
    .expand('personBase')
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
        value: this.buildTroubleshootingRecord(JSON.parse(response.toJSON().body).value)
      };
      return result;
    })
    .catch((error: any) => {});
  },

  queryUncheckedData(param: any) {
    const url = store.getters.configs.communityManagerUrl + 'daily-troubleshoot-record/un-checked';
    return httpClient
      .postPromise(url, param)
      .then(res => {
        return res;
      })
      .catch(err => {
        return false;
      });
  },

  async pullNewData() {
    const communityId = await dataSourceService.getCommunityDataSourceId();
    const url = store.getters.configs.communityManagerUrl + `timer/${communityId}`;
    return httpClient
      .getPromise(url)
      .then(res => {
        return res;
      })
      .catch(err => {
        return false;
      });
  },

  getCheckedCount(conditions: DailyQueryConditions) {
    const q = odataClient({
      service: store.getters.configs.communityManagerOdataUrl,
      resources: 'TroubleshootRecordEntity'
    });
    let filterStr = '';
    if (conditions.keyWord) {
      // tslint:disable-next-line:max-line-length
      filterStr += 'contains( personBase/name, \'' + conditions.keyWord + '\') or contains( personBase/address, \'' + conditions.keyWord + '\') or contains( personBase/phone, \'' + conditions.keyWord + '\')';
      const keywordList = conditions.keyWord.split('-');
      let building = '';
      let unitNumber = '';
      let roomNo = '';
      let bstr = '';
      if ( keywordList.length > 0 ) {
        building =  keywordList[0];
        bstr += 'contains( building, \'' + building + '\')';
      }
      if ( keywordList.length > 1 ) {
        unitNumber =  keywordList[1];
        bstr += ' and contains( unitNumber, \'' + unitNumber + '\')';
      }
      if ( keywordList.length > 2 ) {
        roomNo =  keywordList[2];
        bstr += ' and contains( roomNo, \'' + roomNo + '\')';
      }
      if (bstr) {
        filterStr = '(' + filterStr + ' or ' + bstr + ')';
      }
    }
    if (conditions.plots && conditions.plots.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.plots.length - 1; i < conditions.plots.length; i++) {
          const id = conditions.plots[i];
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

    if (conditions.medicalOpinion && conditions.medicalOpinion.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.medicalOpinion.length - 1; i < conditions.medicalOpinion.length; i++) {
          const id = conditions.medicalOpinion[i];
          if (i !== len) {
              str += '(medicalOpinion eq \'' + id + '\') or ';
          } else {
              str = '(' + str + '(medicalOpinion eq \'' + id + '\')' + ')';
              if (filterStr) {
                filterStr = filterStr + ' and ' + str;
              } else {
                filterStr += str;
              }
          }
      }
    }

    if (conditions.isFaver && conditions.isFaver.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.isFaver.length - 1; i < conditions.isFaver.length; i++) {
          const value = conditions.isFaver[i];
          if (i !== len) {
              str += '(isExceedTemp eq ' + value + ') or ';
          } else {
              str = '(' + str + '(isExceedTemp eq ' + value + ')' + ')';
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
    const multiTenancy = SessionStorage.get('district');
      filterStr += ' and (multiTenancy eq \'' + multiTenancy + '\')';
    if (filterStr) {
      return q
        .skip(conditions.pageSize * (conditions.page))
        .top(conditions.pageSize)
        .filter(filterStr)
        .count(true)
        .get(null)
        .then((response: any) => {
          return JSON.parse(response.body)['@odata.count'];
        })
        .catch((error: any) => {});
    } else {
      return q
        .skip(conditions.pageSize * (conditions.page))
        .top(conditions.pageSize)
        .count(true)
        .get(null)
        .then((response: any) => {
          console.log(response);
          return JSON.parse(response.body)['@odata.count'];
        })
        .catch((error: any) => {});
    }
  },

  getUnCheckedCount(conditions: DailyQueryConditions) {
    const q = odataClient({
      service: store.getters.configs.communityManagerOdataUrl,
      resources: 'TroubleshootRecordEntity'
    });
    let filterStr = '';
    if (conditions.keyWord) {
      // tslint:disable-next-line:max-line-length
      filterStr += 'contains( personBase/name, \'' + conditions.keyWord + '\') or contains( personBase/address, \'' + conditions.keyWord + '\') or contains( personBase/phone, \'' + conditions.keyWord + '\')';
      const keywordList = conditions.keyWord.split('-');
      let building = '';
      let unitNumber = '';
      let roomNo = '';
      let bstr = '';
      if ( keywordList.length > 0 ) {
        building =  keywordList[0];
        bstr += 'contains( building, \'' + building + '\')';
      }
      if ( keywordList.length > 1 ) {
        unitNumber =  keywordList[1];
        bstr += ' and contains( unitNumber, \'' + unitNumber + '\')';
      }
      if ( keywordList.length > 2 ) {
        roomNo =  keywordList[2];
        bstr += ' and contains( roomNo, \'' + roomNo + '\')';
      }
      if (bstr) {
        filterStr = '(' + filterStr + ' or ' + bstr + ')';
      }
    }
    if (conditions.plots && conditions.plots.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.plots.length - 1; i < conditions.plots.length; i++) {
          const id = conditions.plots[i];
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
    if (conditions.medicalOpinion && conditions.medicalOpinion.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.medicalOpinion.length - 1; i < conditions.medicalOpinion.length; i++) {
          const id = conditions.medicalOpinion[i];
          if (i !== len) {
              str += '(medicalOpinion eq \'' + id + '\') or ';
          } else {
              str = '(' + str + '(medicalOpinion eq \'' + id + '\')' + ')';
              if (filterStr) {
                filterStr = filterStr + ' and ' + str;
              } else {
                filterStr += str;
              }
          }
      }
    }
    if (conditions.isFaver && conditions.isFaver.length > 0) {
      let str = '';
      for (let i = 0, len = conditions.isFaver.length - 1; i < conditions.isFaver.length; i++) {
          const value = conditions.isFaver[i];
          if (i !== len) {
              str += '(isExceedTemp eq ' + value + ') or ';
          } else {
              str = '(' + str + '(isExceedTemp eq ' + value + ')' + ')';
              if (filterStr) {
                filterStr = filterStr + ' and ' + str;
              } else {
                filterStr += str;
              }
          }
      }
    }
    const startTime = moment().startOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    // const endTime = moment().endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]');
    if (filterStr) {
      filterStr = '(createTime lt ' + startTime + ') and ' + filterStr;
    } else {
      filterStr = '(createTime lt ' + startTime + ')';
    }
    const multiTenancy = SessionStorage.get('district');
      filterStr += ' and (multiTenancy eq \'' + multiTenancy + '\')';
    if (filterStr) {
      return q
        .skip(conditions.pageSize * (conditions.page))
        .top(conditions.pageSize)
        .filter(filterStr)
        .count(true)
        .get(null)
        .then((response: any) => {
          return JSON.parse(response.body)['@odata.count'];
        })
        .catch((error: any) => {});
    } else {
      return q
        .skip(conditions.pageSize * (conditions.page))
        .top(conditions.pageSize)
        .count(true)
        .get(null)
        .then((response: any) => {
          return JSON.parse(response.body)['@odata.count'];
        })
        .catch((error: any) => {});
    }
  },

  /**
   * 判断用户是否存在
   * @param {string} name
   * @param {number} phoneNumber
   */
  isUserDuplicate(name: string, phone: string) {
    const q = odataClient({
      service: store.getters.configs.communityManagerOdataUrl,
      resources: 'PersonBaseEntity'
    });
    const filterStr = '(name eq \'' + name + '\') and (phone eq \'' + phone + '\')';
    return q.skip(0).filter(filterStr).count(true).get(null).then((response: any) => {
      console.log(JSON.parse(response.body)['@odata.count']);
      return JSON.parse(response.body)['@odata.count'] > 0 ? true : false;
    })
    .catch((error: any) => {});
  }

};
