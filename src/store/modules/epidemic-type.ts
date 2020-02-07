import axios from 'axios';

const epidemicType = {
  state: {
    epidemicTypes: []
  },
  actions: {
    onLoadEpidemicTypes({ dispatch }: any, payloads: any) {
      dispatch('loadEpidemicTypes');
    }
  },
  mutations: {
    async loadEpidemicTypes(state: any, payloads: any) {
      state.epidemicTypes = await axios.get('');
    }
  }
};

export default epidemicType;
