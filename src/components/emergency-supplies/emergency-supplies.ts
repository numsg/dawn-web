import { Vue, Component } from 'vue-property-decorator';
import emergencySuppliesHtml from './emergency-supplies.html';
import emergencySuppliesStyle from './emergency-supplies.scss';

@Component({
  template: emergencySuppliesHtml,
  style: emergencySuppliesStyle,
  components: {}
})
export class EmergencySuppliesComponent extends Vue {

}
