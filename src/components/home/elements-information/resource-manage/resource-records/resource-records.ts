import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import ResourceRecordsStyle from './resource-records.module.scss';
import ResourceRecordsHtml from './resource-records.html';

@Component({
  template: ResourceRecordsHtml,
  style: ResourceRecordsStyle,
  themes: [{ name: 'white', style: ResourceRecordsStyle }],
  components: {
  }
})
export class ResourceRecords extends Vue {
  @Prop( { default: () => {} })
  private currentRes!: any;
}
