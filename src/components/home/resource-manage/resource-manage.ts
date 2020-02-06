import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import resourceManageStyle from './resource-manage.module.scss';
import resourceManageHtml from './resource-manage.html';

@Component({
  template: resourceManageHtml,
  style: resourceManageStyle,
  themes: [{ name: 'white', style: resourceManageStyle }],
  components: {}
})
export class ResourceManageComponent extends Vue {

}
