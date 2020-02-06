import LocalStorage from '@/utils/local-storage';
import SessionStorage from '@/utils/session-storage';

export default {
  async getRouterCom(componentPath: any) {
    let element;
    const component = import('@/components/' + componentPath);
    return await component.then((o: any) => {
      for (const pro in o) {
        if (pro !== null) {
          element = o[pro];
          return element;
        }
      }
    });
  },


  handleRole(componentName: any) {
    if (!SessionStorage.get('handleCom')) {
      return null;
    }
    const temp = SessionStorage.get('handleCom').filter((e: any) => e.componentName === componentName);
    const obj = Object.create(null);
    temp.forEach((element: any) => {
      obj[element.priName] = element.isPrivelege;
    });
    return obj;
  }

};
