import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import accessControlEdiStyle from './access-control-edit.module.scss';
import accessControlEdiHtml from './access-control-edit.html';

@Component({
  template: accessControlEdiHtml,
  style: accessControlEdiStyle,
  themes: [{ name: 'white', style: accessControlEdiHtml }],
  components: {
  }
})
export class AccessControlEdit extends Vue {
  private resformEdit = {
    resId: '1111111111111111',
    resName: '口罩',
    resType: 'N95',
    resSpec: '1片',
    resCount: 200,
    resunit: '片',
    resUpdateTime: '2020.2.1'
  };
  created() {
    console.log('ResourceEdit') ;
  }
  colse() {
    this.$emit('colse');
  }
  submit() {
    this.colse();
  }
}
