import { Vue, Component } from 'vue-property-decorator';
import styles from './hebdomad-diagonsis.module.scss';
import template from './hebdomad-diagonsis.html';
import { ECharts, EChartOption } from 'echarts';
import * as echarts from 'echarts';
import _ from 'lodash';

@Component({
  name: 'hebdomad-diagonsis',
  template: template,
  style: styles,
  components: {}
})
export class HebdomadDiagonsis extends Vue {}
