import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from '@/components/share/side-frame/side-frame.html';
import Style from '@/components/share/side-frame/side-frame.module.scss';
import sideBlackStyle from './side-frame.black.module.scss';
import sideStyle from './side-frame.module.scss';

@Component({
  template: Html,
  style: Style,
  themes: [{ name: 'white', style: sideStyle }, { name: 'black', style: sideBlackStyle }],
  components: {}
})
export class SideFrameComponent extends Vue {
  @Prop({
    default: false
  })
  slideIn!: boolean;

  visible: boolean = false;

  showFrame: boolean = false;

  showWrapper: boolean = false;

  @Prop({
    default: 0
  })
  top!: any;

  @Prop({
    type: Function
  })
  beforeClose!: any;

  @Watch('slideIn')
  onVisibleChange() {
    this.visible = this.slideIn;
  }

  @Watch('visible')
  onpageshow(bool: boolean) {
    if (bool) {
      this.showWrapper = bool;
      setTimeout(() => (this.showFrame = bool), 100);
    } else {
      if (this.beforeClose) {
        this.beforeClose(this.setSlideFrameClose, this.cancelFrameClose);
      } else {
        this.setSlideFrameClose();
      }
    }
  }

  setSlideFrameClose() {
    this.showFrame = false;
    setTimeout(() => (this.showWrapper = false), 600);
  }

  cancelFrameClose() {
    this.visible = true;
  }

  open() {
    this.visible = true;
    this.$emit('open');
  }

  close() {
    this.visible = false;
    this.$emit('close');
  }

  outsideClick() {
    this.close();
  }
}
