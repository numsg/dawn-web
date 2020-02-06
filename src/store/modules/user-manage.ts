import { State } from 'vuex-class';

const userManage = {
    state: {
        isCurUserUpdate: false
    },
    mutations: {
        SET_ISCUR_USER_UPDATE: (state: any, result: any) => {
            state.isCurUserUpdate = result;
        }
    },
    actions: {
        OnCurChange({ commit }: any , payloads: any) {
            commit('SET_ISCUR_USER_UPDATE', payloads);
        }
    },
    getters: {
        userManage_isCurUserUpdate: (state: any) => state.isCurUserUpdate
    }
};

export default userManage;
