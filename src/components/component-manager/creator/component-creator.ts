import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import template from './component-creator.html';
import styles from './component-creator.module.scss';
import { ComponentCreator } from '@gsafety/whatever/dist/components/component-creator';
import { PmsComponentEditor } from '../editor/component-editor';
import { PmsCompTemplateManager } from '../template/component-template';

@Component({
  name: 'pms-component-creator',
  template: template,
  style: styles,
  components: { ComponentCreator, PmsComponentEditor, PmsCompTemplateManager }
})
export class PmsComponentCreator extends Vue {
  @Prop({
    default: () => {
      return {};
    }
  })
  creator: any;

  // @Watch('creator', { deep: true })
  // handleCreatorPropsChange(val: any) {
  //   console.log('-------------------- creator props change --------------------');
  //   console.log(val);
  // }

  // mounted() {
  //   console.log('-------------------- first load creator ------------------');
  //   console.log(this.creator);
  // }
}
