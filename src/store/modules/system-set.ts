import systemSetService from '@/api/system-set/system-set.service';

const systemSet = {
  state: {
    systemSetOptions: {
      systemName: '',
      systemImg: ''
    }
  },
  mutations: {
    SYSTEM_SET_DAT: (state: any, result: any) => {
      state.systemSetOptions.systemName = result.systemName;
      window.document.title = result.systemName;
      state.systemSetOptions.systemImg = result.systemLogo;
    }
  },
  actions: {
    async SystemSetData({ commit }: any) {
      const result = await systemSetService.querySystemSet();
      if (result) {
        commit('SYSTEM_SET_DAT', JSON.parse(JSON.parse(result.body)).value[0] );
      }
    },
  },
  getters: {
    systemSetOptions: (state: any) => state.systemSetOptions
  }
};

export default systemSet;
