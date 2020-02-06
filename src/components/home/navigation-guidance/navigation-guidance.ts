import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import NavigationGuidanceStyle from './navigation-guidance.module.scss';
import NavigationGuidanceHtml from './navigation-guidance.html';
import navigationStyle from './navigation-guidance.module.scss';
import navigationBlackStyle from './navigation-guidance.black.module.scss';

@Component({
  template: NavigationGuidanceHtml,
  style: NavigationGuidanceStyle,
  themes: [{ name: 'white', style: navigationStyle }, { name: 'black', style: navigationBlackStyle }],
  components: {}
})
export class NavigationGuidanceComponent extends Vue {
  @Prop({
    default: 10,
  })
  span!: number;

  mounted() {
  }

  handleNavigator(routerName: string) {
    this.$router.push({ name: routerName });
  }
}
