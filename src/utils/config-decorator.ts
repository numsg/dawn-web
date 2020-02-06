import { createDecorator } from 'vue-class-component';
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import { ComponentOptions } from 'vue';
import store from '@/store';

export const Config = (key: string) => {
  return createDecorator((componentOptions: ComponentOptions<Vue>, proto: string) => {
    if (!componentOptions['computed']) {
      componentOptions['computed'] = {};
    }
    componentOptions['computed'][proto] = () => {
      if (key.includes('.')) {
        const k = key.split('.')[0];
        const v = key.split('.')[1];
        return store.getters.configs[k][v];
      }
      return store.getters.configs[key];
    };
  });
};
export default Config;
