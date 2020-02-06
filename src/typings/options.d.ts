import Vue from 'vue';
// ComponentOptions is declared in types/options.d.ts
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    style?: any;
    themes?: any;
  }
}
declare module 'vue-router/types/router' {
  interface VueRouter {
    options: any;
  }
}
