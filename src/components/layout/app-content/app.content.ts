import { Vue, Component } from 'vue-property-decorator';
import contentStyle from './app.content.module.scss';
import contentBlackStyle from './app.black-content.module.scss';

@Component({
  template: require('./app.content.html'),
  style: contentStyle,
  themes: [{ name: 'white', style: contentStyle }, { name: 'black', style: contentBlackStyle }],
  components: {
  }
})
export class AppContentComponent extends Vue {
  sysName: any = 'ADMIN';
  collapsed = false;
  sysUserName: any = '';

  public collapse() {
    this.collapsed = !this.collapsed;
  }
}
