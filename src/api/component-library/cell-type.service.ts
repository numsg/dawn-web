
import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';

import odataClient from '@gsafety/odata-client/dist';

export default {



    queryCellType(): Promise<any> {
        const q = odataClient({
            service: store.getters.configs.baseSupportOdataUrl,
            resources: 'CellTypeEntity',
        });
        return q.skip(0)
            .get(null)
            .then((response: any) => {
                return JSON.parse(response.body).value;
            }).catch((error: any) => { });
    }


};
