import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import serviceManageStyle from './service-manage.module.scss';
import serviceManageHtml from './service-manage.html';

@Component({
  template: serviceManageHtml,
  style: serviceManageStyle,
  themes: [{ name: 'white', style: serviceManageStyle }],
  components: {}
})
export class ServiceManageComponent extends Vue {

}
