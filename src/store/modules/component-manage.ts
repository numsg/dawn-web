import cellTypeService from '@/api/base-data-define/cell-type.service';
import axios from 'axios';

export const PMSComponentManager = {
  state: {
    componentProps: {
      componentTypes: [],
      resourceTypes: [],
      epidemicTypes: []
    }
  },
  mutations: {
    async LOAD_COMPONENT_TYPES(state: any, payloads: any) {
      const response = await cellTypeService.queryCellType();
      if (Array.isArray(response)) {
        state.componentProps.componentTypes = response;
      }
    },
    async LOAD_RESOURCE_TYPES(state: any, payloads: any) {
      const response = await cellTypeService.queryCellType();
      if (Array.isArray(response)) {
        state.componentProps.componentTypes = response;
      }
    },
    async LOAD_EPIDEMIC_TYPES(state: any, payloads: any) {
      state.epidemicTypes = await axios.get('');
    }
  },
  actions: {
    onLoadComponentTypes({ commit }: any, payloads: any) {
      commit('LOAD_COMPONENT_TYPES');
    },
    onLoadResourceTypoes({ commit }: any, payloads: any) {
      commit('LOAD_COMPONENT_TYPES');
    },
    onLoadEpidemicTypes({ commit }: any, payloads: any) {
      commit('LOAD_EPIDEMIC_TYPES');
    }
  }
};
