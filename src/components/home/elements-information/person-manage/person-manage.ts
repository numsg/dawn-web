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
  private currentPage = 0;
  private pageSize = 4;
  private pageSizes = [4, 8, 12];
  private personDate = [
    {
      personId: '21341234234',
      personRoom: '1-1-101',
      name: '张三',
      personTel: '1397261562',
      personSpecial: '否',
      personDestination: '湖北省',
      otherPerson: '否',
      personHealth: '良好',
      medical: '无',
      confirmed: '无',
      fillTime: '2019-2-2 12:12:12'
    },
    {
      personId: '21341234234',
      personRoom: '1-1-101',
      name: '张三',
      personTel: '1397261562',
      personSpecial: '否',
      personDestination: '湖北省',
      otherPerson: '否',
      personHealth: '2020.2.1',
      medical: '无',
      confirmed: '无',
      fillTime: '2019-2-2 12:12:12'
    }
  ];

  showTransfersDialog() {

  }

  handleSizeChange() {

  }

  handleCurrentChange() {

  }
}
