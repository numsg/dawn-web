import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import personManageStyle from './person-manage.module.scss';
import personManageHtml from './person-manage.html';

@Component({
  template: personManageHtml,
  style: personManageStyle,
  themes: [{ name: 'white', style: personManageStyle }],
  components: {}
})
export class PersonManage extends Vue {

}
