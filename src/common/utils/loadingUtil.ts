import { Loading, Notification } from 'element-ui';
import { ElLoadingComponent } from 'element-ui/types/loading';
import i18n from '@/i18n';

const theme = localStorage.getItem('system-theme');

export default class LoadingUtil {

    static loading: ElLoadingComponent;

    static startLoading(target: any, message: string = i18n.t('data_source.data_source_import.data_load').toString()) {
        LoadingUtil.loading = Loading.service({
            target: target,
            lock: true,
            text: message,
            background: theme === 'white' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(30, 55, 99, 0.7)',
            spinner: ''
        });
    }

    static closeLoading() {
        LoadingUtil.loading.close();
    }
}


