import { Vue, Component } from 'vue-property-decorator';
import errorBizStyle from './error.biz.module.scss';

@Component({
    template: require('./error.biz.html'),
    style: errorBizStyle,
    components: {
    }
  })
export class ErrorChildComponent extends Vue {

}
