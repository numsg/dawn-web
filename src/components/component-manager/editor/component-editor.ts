import { Vue, Component, Prop } from 'vue-property-decorator';
import template from './component-editor.html';
import style from './component-editor.module.scss';
import { PmsComponentPreviewer } from '../previewer/component-previewer';
import { ComponentEditorLauncher } from '@gsafety/whatever/dist';
import StoreEvents from '@/common/events/store-events';

@Component({
  template: template,
  style: style,
  components: {
    PmsComponentPreviewer,
    ComponentEditorLauncher
  }
})
export class PmsComponentEditor extends Vue {
  @Prop({
    default: () => {
      return {};
    }
  })
  editor: any;
  @Prop({
    default: false
  })
  saveToLocalCache!: boolean;
  /**
   * 元件附加属性
   *
   * @type {*}
   * @memberof PmsComponentPreviewer
   */
  componentExtraInfo: any = { tag: '' };

  options = {
    showComponentTitle: false,
    normalDisplay: false,
    showBasicInfo: true,
    readMode: false,
    printMode: true
  };
  created() {
    this.$store.dispatch(StoreEvents.PMSComponentManage.onLoadComponentTypes);
    this.$store.dispatch(StoreEvents.EventTypes.LoadEventTypes);
  }

  mounted() {
    if (this.editor && Object.keys(this.editor).indexOf('component') >= 0) {
      this.componentExtraInfo = this.editor.component.extraInfo ? this.editor.component.extraInfo : { tag: '' };
    }
  }

  handlePreviewValidation(flag: any) {
    const editor = this.$refs['componentEditor'];
    this.$set(editor, 'enableBtnSave', flag);
  }
}
