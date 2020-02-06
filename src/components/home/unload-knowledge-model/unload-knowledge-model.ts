import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import UnloadKnowledgeModelStyle from './unload-knowledge-model.module.scss';
import UnloadKnowledgeModelHtml from './unload-knowledge-model.html';

import moment from 'moment';
import UnloadStyle from './unload-knowledge-model.module.scss';
import UnloadBlackStyle from './unload-knowledge-model.black.module.scss';
// import knowledgeMatrixService from '@/api/knowledge-matrix/knowledge-matrix.service';

import eventNames from '@/common/events/store-events';
import notifyUtil from '@/common/utils/notifyUtil';

@Component({
  template: UnloadKnowledgeModelHtml,
  style: UnloadKnowledgeModelStyle,
  themes: [{ name: 'white', style: UnloadStyle }, { name: 'black', style: UnloadBlackStyle }],
  components: {},
  filters: {
    timeFormat: (data: any) => {
      if (data) {
        return moment(data)
          .utc(false)
          .format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }
})
export class UnloadKnowledgeModelComponent extends Vue {
  @Prop({
    default: 11
  })
  span!: number;

  modelList: Array<any> = [];

  @Watch('span', { deep: true })
  onSpansChange(val: any) {}
  mounted() {
    this.initData();
  }

  async initData() {

  }

  handleData(data: any) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key];
        if (element && Array.isArray(element) && element.length > 0) {
          element[0]['icon'] = element[0].image ? JSON.parse(element[0].image) : {};
          this.modelList.push(element[0]);
        }
      }
    }
  }

  onRemoveModel(item: any) {
    this.$confirm(this.$tc('knowledge_matrix.unload_confirm'), {
      confirmButtonText: this.$tc('common.determine'),
      cancelButtonText: this.$tc('common.cancel'),
      type: 'warning',
      title: this.$tc('common.prompt'),
      showClose: false
    })
      .then(() => {
        this.onUnload(item);
      })
      .catch(() => {});
  }
  async onUnload(item: any) {

  }

  writeUnloadLog(item: any) {
    const user: any = sessionStorage.getItem('userInfo');
    const logData = { name: item.name };
    this.$store.dispatch(eventNames.SystemLog.UnloadKnowledge, {
      data: logData,
      router: { name: 'home' },
      user: user,
      dataType: 'unload_knowledge_model'
    });
  }
}
