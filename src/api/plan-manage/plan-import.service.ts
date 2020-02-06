import store from '@/store';
import { PlanManageUrl } from '@/common/url/plan-manage-url';
import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import axios from 'axios';

export default {

  // 预案导入
  planImport(file: any): Promise<any> {
    const url = store.getters.configs.planFileUrl + PlanManageUrl.planImport;
    return httpClient.postPromise(url, file);
  },

  // 预案导出
  async planExport(data: any) {
    const url = store.getters.configs.planFileUrl + PlanManageUrl.planExport;
    // await this.exportWord(url, data);
    await this.getBlob(url, 2, data).then((blob: Blob) => {
      this.saveAs(blob, data.name + '.docx');
    });
  },


  // 获取附件和导出预案
  getBlob(url: any, type: any, planDigitalModel?: any) {
    let resType = 'GET';
    if (type === 2) {
      resType = 'POST';
    }
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.open(resType, url, true);
      xhr.responseType = 'blob';
      // xhr.responseType = 'arraybuffer';
      xhr.send(new Blob([JSON.stringify(planDigitalModel)]));   // { type: 'application/msword' }
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        }
      };
    });
  },

  // 保存
  saveAs(blob: any, name: any) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, name);
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = name;
      link.click();
    }
  },


  // word导出 弃用
  exportWord(url: any, data: any) {
    axios.post(url, data, {
      responseType: 'arraybuffer'
    }).then(res => {
      console.log(res);
      if (res.status === 200) {
        const blob = new Blob([res.data] , {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = 'zzz.docx';
        link.href = objectUrl;
        link.setAttribute('download' , fileName);
        document.body.appendChild(link);
        link.click();
      }
    });
  }
};
