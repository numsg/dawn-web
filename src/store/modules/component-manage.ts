import cellTypeService from '@/api/base-data-define/cell-type.service';

export const PMSComponentManager = {
  state: {
    componentProps: {
      componentTypes: []
    }
  },
  mutations: {
    async LOAD_COMPONENT_TYPES(state: any, payloads: any) {
      const response = await cellTypeService.queryCellType();
      if (Array.isArray(response)) {
        state.componentProps.componentTypes = response;
      }
    }
  },
  actions: {
    onLoadComponentTypes({ commit }: any, payloads: any) {
      commit('LOAD_COMPONENT_TYPES');
    }
  }
};
