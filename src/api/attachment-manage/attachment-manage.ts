import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import odataClient from '@gsafety/odata-client/dist';

export default {
  uoloadAttachment(file: any): Promise<any> {
    const url = store.getters.configs.planPreparationUrl + 'files/upload';
    return httpClient.postPromise(url, file, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });
  },
  deleteAttachment(fileId: any, type: any): Promise<any> {
    const url = store.getters.configs.planPreparationUrl + 'files/' + fileId + '/' + type;
    return httpClient
      .deletePromise(url)
      .then(res => {
        return res;
      })
      .catch((err: any) => {
        return false;
      });
  },
  relevanceBusinessId(files: any) {
    const url = store.getters.configs.planPreparationUrl + 'attachments';
    return httpClient
      .postPromise(url, files)
      .then(res => {
        return res;
      })
      .catch((err: any) => {
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

  buildData(data: any) {
    const files: any = [];
    data.forEach((file: any) => {
      const newFile = {
        name: file.name,
        id: file.id,
        businessId: file.businessId,
        type: file.type,
        uploadTime: file.uploadTime,
        size: file.size + 'kb',
        showType: file.name.substr(String(file.name).lastIndexOf('.' + 1, file.name.length - 1))
      };
      console.log(file.name.lastIndexOf('.' + 1), newFile);
      files.push(newFile);
    });
    return files;
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
