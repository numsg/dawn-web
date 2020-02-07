import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import resourceEditStyle from './resource-edit.module.scss';
import resourceEditHtml from './resource-edit.html';

@Component({
  template: resourceEditHtml,
  style: resourceEditStyle,
  themes: [{ name: 'white', style: resourceEditStyle }],
  components: {}
})
export class ResourceEdit extends Vue {
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
