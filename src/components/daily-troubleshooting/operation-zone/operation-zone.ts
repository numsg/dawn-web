import { Vue, Component } from 'vue-property-decorator';
import Html from './operation-zone.html';
import Style from './operation-zone.module.scss';

@Component({
  template: Html,
  style: Style,
  components: {}
})
export class OperationZone extends Vue {

    keyWords = '';
    handleSort() {

    }

    resetPlans() {

    }

    searchByKeyWords() {

    }
}
