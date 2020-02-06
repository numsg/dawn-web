import { Vue, Component } from 'vue-property-decorator';
import { AppContentComponent } from './app-content/app.content';
import { AppHeaderComponent } from './app-header/app.header';
// import { NavbarComponent } from "./navbar/navbar";

import layoutStyle from './layout.module.scss';
import { Getter } from 'vuex-class';

import layoutBlackStyle from './layout.black.module.scss';

@Component({
  template: require('./layout.html'),
  style: layoutStyle,
  themes: [
    { name: 'white', style: layoutStyle },
    { name: 'black', style: layoutBlackStyle }
  ],
  components: {
    'app-header': AppHeaderComponent,
    'app-content': AppContentComponent
    // 'nav-bar': NavbarComponent
  }
})
export class LayoutComponent extends Vue {
  @Getter('layout_loading')
  loading!: boolean;

  @Getter('layout_loadingText')
  loadingText!: string;

  @Getter('layout_background')
  loadingBackground!: boolean;

  @Getter('layout_spinner')
  loadingSpinner!: string;

  mounted() {
    document.body.addEventListener('dblclick', () => {
      const annotationContainer: any = document.getElementById('globalComment');
      if (annotationContainer && annotationContainer.__vue__.showPanel) {
        annotationContainer.__vue__.showPanel = false;
      }
      const fragmentContainer = document.getElementById('fragmentioner-ui');
      if (fragmentContainer && !fragmentContainer.hidden) {
        fragmentContainer.hidden = true;
      }
    });
  }
}
