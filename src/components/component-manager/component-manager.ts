import { Vue, Component } from 'vue-property-decorator';

import template from './component-manager.html';
import style from './component-manager.module.scss';

import { ComponentManager } from '@gsafety/whatever/dist';
import { PmsComponentList } from './library/component-list';
import { PmsComponentEditor } from './editor/component-editor';
import { PmsComponentCreator } from './creator/component-creator';
import './overwrite.scss';
import componentBlackStyle from './component-manager.black.module.scss';
import { RouteLeaveDialog } from '@/components/share/route-leave-dialog/route-leave-dialog';

@Component({
  template: template,
  style: style,
  themes: [{ name: 'white', style: style }, { name: 'black', style: componentBlackStyle }],
  components: {
    ComponentManager, PmsComponentList, PmsComponentEditor, PmsComponentCreator, RouteLeaveDialog

  },
  beforeRouteLeave(to: any, from: any, next: any) {
    const el: any = this;
    el.toRouter = to;
    const comManager = el.$refs['componentManager'];
    if (comManager.showEditor || comManager.showCreator) {
      if (!el.isRedirect) {
        el.dialogVisible = true;
      } else {
        next();
      }
    } else {
      next();
    }
  }
})
export class PmsComponentManager extends Vue {
  //#region compute properties
  //#endregion
  //#region data define
  inComponentEditState = false;
  isRedirect: boolean = false;
  dialogVisible: boolean = false;
  toRouter: any;
  //#endregion
  //#region methods
  handleEditorShown() {
    this.inComponentEditState = true;
  }
  handleEditorClose() {
    this.inComponentEditState = false;
  }
  handleNavigateToTemplateMgr() {
    this.$router.push({ path: 'template-manager' });
  }
  handleRouteLeave() {
    this.isRedirect = true;
    this.dialogVisible = false;
    this.$router.push({ name: this.toRouter.name });
  }
  //#endregion
}
