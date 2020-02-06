import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { LeftNavigationComponent } from './left-navigation/left-navigation';
import { RightContentComponent } from './right-content/right-content';
import systemConfigService from '@/api/system-config/system-config.service';
import eventNames from '@/common/events/store-events';
import { Getter } from 'vuex-class';

import Html from './system-configs.html';
import styles from './system-configs.module.scss';
import draggable from 'vuedraggable';
import SystemConfig from '@/models/common/system-config-model';
import SystemBlackStyle from './system-configs.black.module.scss';
import PriRouter from '@/utils/pri-router';

import store from '@/store';
@Component({
  template: Html,
  style: styles,
  themes: [{ name: 'white', style: styles }, { name: 'black', style: SystemBlackStyle }],
  components: {
    draggable: draggable,
    'el-left-navigation': LeftNavigationComponent,
    'el-right-content': RightContentComponent
  }
})
export class SystemConfigsComponent extends Vue {
  // 是否新增成功
  isAddSuccess: any = false;

  // 点击的左侧导航项Id
  leftClickItemId: any = '';

  // 左侧默认聚焦的导航项id
  defaultActiveId: any = '';

  // 就是systemConfigs
  data: any = [];

  @Getter('systemConfigs') systemConfigs!: Array<SystemConfig>;

  keyWords: any = '';

  private get rolePrivilege(): any {
    return PriRouter.handleRole('system-config');
  }

  @Watch('keyWords')
  async keyWordSearch() {
    const keywords = this.keyWords.replace(/\s/g, '');
    if (keywords) {
      const result: Array<any> = [];
      await this.$store.dispatch(eventNames.SystemConfig.LoadSystemConfigs);
      this.data = this.systemConfigs;
      this.systemConfigs.forEach((parent: any) => {
        if (this.$tc(parent.name).includes(String(keywords))) {
          result.push(parent);
        } else {
          const config = new SystemConfig();
          config.id = parent.id;
          config.key = parent.key;
          config.name = parent.name;
          config.pid = parent.pid;
          config.value = parent.value;
          config.description = parent.description;
          config.children = [];
          parent.children.forEach((child: any) => {
            if (child.key.includes(String(keywords)) || child.value.includes(String(keywords))) {
              config.children.push(child);
            } else if (
              this.$te(child.name) &&
              (this.$tc(child.name).includes(String(keywords)) || this.$tc(child.description).includes(String(keywords)))
            ) {
              // 当前项进行了国际化
              config.children.push(child);
            } else if (!this.$te(child.name) && (child.name.includes(String(keywords)) || child.description.includes(String(keywords)))) {
              // 当前项没有国际化
              config.children.push(child);
            }
          });
          if (config.children.length > 0) {
            result.push(config);
          }
        }
      });
      this.data = result;
    } else {
      this.data = this.systemConfigs;
    }
  }

  async mounted() {
   await this.$store.dispatch(eventNames.SystemConfig.LoadSystemConfigs);
    this.loadData();
  }
   loadData() {
    this.data = this.systemConfigs;
    this.defaultActiveId = store.getters.systemConfigs[0].children[0].id;
    this.leftClickItemId = this.defaultActiveId;
  }

  // 将点击的左侧导航项id传递给右侧内容区。
  onNavigationItem(itemId: any) {
    this.leftClickItemId = itemId;
  }

  // 将点击的右侧内容项id传递给左侧导航栏。
  onContentItem(itemId: any) {
    this.defaultActiveId = itemId;
  }
}
