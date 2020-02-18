import moment from 'moment';
import notifyUtil from '@/common/utils/notifyUtil';
import * as XLSX from 'xlsx';

export default {

  // 导出excel
  exportExcel(param: { title: string, communityName: string, sheetName: string,
     execlName: string, headerNames: string[],  data: any[] }) {
    const {title, communityName, sheetName, execlName, headerNames, data} = param;
    if (!data) {
      notifyUtil.warning('查找记录失败');
    }
    if (!communityName) {
        notifyUtil.warning('请输入社区名称');
    }
    const sn  = sheetName ? sheetName : 'mySheet';
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const en = execlName ? `${execlName}.xlsx` : `${now}.xlsx`;
    const s = {
        alignment: {
          horizontal: 'center',
          vertical: 'center'
        }
      };
    // 构造表头
    // 1.固定表头
    const unalteredHeaders = {
      A1: { v: title, s },
      A2: { v: '社区(村)', s },
      C2: { v: communityName, s },
      G2: { v: '制表日期', s },
      H2: { v: now, s }
    };
    // 2.构造数据相关联表头
    let alterableHeaders = {};
    const dataRowHight: any[] = [];
    const cols = [] as any[];
    const startRowNumber = 3;
    const rowHeight = 24;
    const startChat = 'A';
    headerNames.forEach((name: string, index: number) => {
      dataRowHight.push({ hpx: rowHeight }); // 单元格高度
      cols.push({ wch: name.length * 2 + 2 }); // 单元格宽度
      const number = startChat.charCodeAt(0);
      let colIndex = '';
      if (index < 26) {
        colIndex = String.fromCharCode(number + index);
      } else {
        colIndex = `${startChat}${String.fromCharCode(number + index - 26)}`;
      }
      const rowHeader = {
        [`${colIndex}${startRowNumber}`]: { v: name, s }
      };
      alterableHeaders = Object.assign({}, alterableHeaders, rowHeader);
    });
    const headers = Object.assign({}, unalteredHeaders, alterableHeaders);
    // 构造表格数据
    let rowsData = {};
    data.forEach((item, index) => {
      let rowData = {};
      const colProps = Object.keys(item);
      colProps.forEach((prop, i) => {
        const number = startChat.charCodeAt(0);
        let colIndex = '';
        if (i < 26) {
          colIndex = String.fromCharCode(number + i);
        } else {
          colIndex = `${startChat}${String.fromCharCode(number + i - 26)}`;
        }
        const row = { [`${colIndex}${startRowNumber + 1 + index}`]: { v: item[prop], s } };
        rowData = Object.assign({}, rowData, row);
      });
      rowsData = Object.assign({}, rowsData, rowData);
    });
    // 合并 headers 和 data
    const output = Object.assign({}, headers, rowsData);
    // 表格范围，范围越大生成越慢
    const ref = 'A1:ZZ2000';
    // 合并单元格设置
    const merges = [
      { s: { c: 0, r: 0 }, e: { c: 33, r: 0 } }, // 社区疫情排查情况登记表
      { s: { c: 0, r: 1 }, e: { c: 1, r: 1 } }, // 社区(村)
      { s: { c: 2, r: 1 }, e: { c: 5, r: 1 } }, // 社区(村)
      { s: { c: 6, r: 1 }, e: { c: 6, r: 1 } }, // 填表日期
      { s: { c: 7, r: 1 }, e: { c: 8, r: 1 } } // 填表日期
    ];
    // 构建 workbook 对象
    const rows = [{ hpx: rowHeight }, { hpx: rowHeight }, ...dataRowHight];
    const wb = {
      SheetNames: [sn],
      Sheets: {
        [`${sn}`]: Object.assign({}, output, { '!ref': ref, '!merges': merges, '!cols': cols, '!rows': rows })
      }
    };
    // 导出 Excel
    // bookType: 'xlsx', // 要生成的文件类型
    // bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    // type: 'binary'
    XLSX.writeFile(wb, en, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  },

};
