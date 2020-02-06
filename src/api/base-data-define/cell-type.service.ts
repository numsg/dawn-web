import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import { stringFormat } from '@gsafety/cad-gutil/dist/stringformat';
import odataClient from '@gsafety/odata-client/dist';
import mapperManager from '@/common/odata/mapper-manager.service';
import CellType from '@/models/data-define/cell-type';
import { cellTypeUrl } from '@/common/url/cell-type-url';
import { arrayToTree, treeToArray } from '@/common/utils/utils';
export default {

  /**
   *查询所有元件类型
   *odta方式
   * @returns {Promise<any>}
   */
  queryCellType(): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'CellTypeEntity'
    });
    return q.top(100).orderby('sort', 'asc').get(null)
      .then((response: any) => {
        return this.generateData(JSON.parse(response.body).value, CellType);
      }).catch((err: any) => {
        console.log(err);
      });
  },

  // 根据pid查询元件类型
  queryCellTypesByPid(pid: string): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.odataUrl,
      resources: 'CellTypeEntity'
    });
    return q.filter('pid', 'eq', pid).get().then((response: any) => {
      return JSON.parse(response.body).value;
    })
      .catch((err: any) => {
        console.log(err);
      });
  },
  /**
   * 新增一个元件类型
   *
   * @param {*} cellType 元件类型
   * @returns {Promise<any>}
   */
  addCellType(cellType: any): Promise<any> {
    const baseSupportUrl = store.getters.configs.baseSupportUrl;
    const url = `${baseSupportUrl}${cellTypeUrl.addCellType}`;
    return httpClient.postPromise(url, cellType);
  },
  /**
   * 修改一个元件类型
   *
   * @param {*} cellType 元件类型
   * @returns {Promise<any>}
   */
  updateCellType(cellType: any): Promise<any> {
    const baseSupportUrl = store.getters.configs.baseSupportUrl;
    const url = `${baseSupportUrl}${cellTypeUrl.updateCellType}`;
    return httpClient.putPromise(url, cellType);
  },
  /**
  * 通过id删除一个元件类型
  *
  * @param {*} id  元件类型id
  * @returns {Promise<any>}
  */
  deleteCellType(id: any): Promise<any> {
    const baseSupportUrl = store.getters.configs.baseSupportUrl;
    const url = stringFormat(`${baseSupportUrl}${cellTypeUrl.deleteCellType}`, id);
    return httpClient.deletePromise(url);
  },

  UpdateCellTypeSort(cellTypes: any): Promise<any> {
    const temp = treeToArray(cellTypes);
    const url = store.getters.configs.baseSupportUrl + 'cell-types/sort';
    return httpClient.putPromise(url, this.entityToModel(temp));
  },

  /**
 * 组装数据
 * @param {*} result
 * @param {*} ModeType
 * @returns
 */
  generateData(result: any, ModeType: any) {
    // tslint:disable-next-line:prefer-const
    let dataArr: any[] = [];
    if (Array.isArray(result) && result.length > 0) {
      result.forEach(res => {
        let item = new ModeType();
        item = mapperManager.mapper(res, item);
        dataArr.push(item);
      });
    }
    return dataArr;
  },

  // 数据转换
  entityToModel(result: any) {
    // tslint:disable-next-line:prefer-const
    let cellTypeArr: CellType[] = [];
    if (Array.isArray(result) && result.length > 0) {
      result.forEach(data => {
        let cellType = new CellType();
        cellType = mapperManager.mapper(data, cellType);
        cellType.name = data.label;
        cellType.image = data.image ? JSON.stringify(data.image) : '';
        cellTypeArr.push(cellType);
      });
    }
    return cellTypeArr;
  },
};
