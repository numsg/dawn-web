import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import resourceSearchStyle from './resource-search.module.scss';
import resourceSearchHtml from './resource-search.html';

import { ResourceAdd } from '@/components/home/elements-information/resource-manage/resource-add/resource-add';

import resourceManageService from '@/api/elements-information/resource-manage-service';
@Component({
  template: resourceSearchHtml,
  style: resourceSearchStyle,
  themes: [{ name: 'white', style: resourceSearchStyle }],
  components: {
    ResourceAdd
  }
})
export class ResourceSearch extends Vue {
  private serchValue = '';

  async search() {
    const result = await resourceManageService.querySourceBysearch(this.serchValue);
  }

  addSuccess() {
    this.$emit('refresh');
  }
}
