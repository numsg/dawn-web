import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import ElementsInformationStyle from './elements-information.module.scss';
import ElementsInformationHtml from './elements-information.html';

import { PersonManage } from './person-manage/person-manage';
import { ResourceManage } from './resource-manage/resource-manage';
import { ResourceAdd } from './resource-manage/resource-add/resource-add';

@Component({
  template: ElementsInformationHtml,
  style: ElementsInformationStyle,
  themes: [{ name: 'white', style: ElementsInformationStyle }],
  components: { PersonManage, ResourceManage, ResourceAdd }
})
export class ElementsInformation extends Vue {
  private activeName = 'resource';
  private serchValue = '';

  handleClick() {
    console.log(this.activeName);
  }
}
