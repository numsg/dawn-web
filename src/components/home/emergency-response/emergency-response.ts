import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import emergencyResponseStyle from './emergency-response.module.scss';
import emergencyResponseHtml from './emergency-response.html';

@Component({
  template: emergencyResponseHtml,
  style: emergencyResponseStyle,
  themes: [{ name: 'white', style: emergencyResponseStyle }],
  components: {}
})
export class EmergencyResponseComponent extends Vue {

}
