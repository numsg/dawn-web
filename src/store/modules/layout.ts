import { sleep } from '@/common/utils/utils';
import i18n from '@/i18n';


const theme = localStorage.getItem('system-theme');

const layout = {

    state: {
        options: {
            loading: false,
            loadingText: i18n.t('data_source.data_source_import.data_load'),
            background: theme === 'white' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(30, 55, 99, 0.7)',
            spinner: ''
        }
    },
    mutations: {
        SET_LOADING: (state: any, payloads: boolean | Object) => {
            if (typeof payloads === 'boolean') {
                state.options.loading = payloads;
            } else {
                Object.assign(state.options, payloads);
            }
        },
        CLOSE_LOADING: (state: any) => {
            state.options.loading = false;
        }
    },
    actions: {
        SetLoading: async ({ commit }: any, payloads: any) => {
            if ((typeof payloads === 'boolean' && payloads === false) || payloads.loading === false) {
                await sleep(400);
            }
            commit('SET_LOADING', payloads);
        },
        CloseLoading: ({ commit }: any) => {
            commit('CLOSE_LOADING');
        }
    },
    getters: {
        layout_loading: (state: any) => state.options.loading,
        layout_loadingText: (state: any) => state.options.loadingText,
        layout_background: (state: any) => state.options.background,
        layout_spinner: (state: any) => state.options.spinner,
    }

};

export default layout;
