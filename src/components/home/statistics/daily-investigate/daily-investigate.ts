import { Vue, Component } from 'vue-property-decorator';
import styles from './daily-investigate.module.scss';
import template from './daily-investigate.html';
import { ECharts, EChartOption } from 'echarts';
import * as echarts from 'echarts';
import { verifyArrayEmptyOrUndefined } from '@gsafety/whatever/dist/util';
import _ from 'lodash';

@Component({
  name: 'daily-investigate',
  template: template,
  style: styles,
  components: {}
})
export class DailyInvestigate extends Vue {
histogramChartOptions = {};
histogramChart!: ECharts;
staffStatisticsData = {};
housingEstateData:any = [
    {
        id: '1',
        name:'常德市武陵区丹阳街道紫桥社区'
    },
    {  
        id:'2',
        name:'武汉市江夏区纸坊街道西港社区'
    }
];

currenHousingEstate:any = '1';

mounted(){
// 默认显示某个小区
this.initDailyCharts();
this.setOptions([]);
}
// 切换小区显示该小区排查历史
changeHousingEstate(val:any){
console.log(val);
}

private async initDailyCharts(){
    const lineChartEle: HTMLDivElement = document.querySelector('#staffStatisticsChart') || document.createElement('div');
    this.histogramChart = echarts.init(lineChartEle);
    // TroublesootHistoryRecordEntity  日常排查人员统计
    const data:any = [
        {
           createTime:'2020-02-10',
           count:100
        },
        {
            createTime:'2020-02-11',
            count:150
         },
         {
            createTime:'2020-02-12',
            count:200
         },
         {
            createTime:'2020-02-13',
            count:155
         },
    ];
    this.setOptions(data);
}
private setOptions(datas: Array<any>) {
  const options:any = {
    color: ['#3398DB'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%', 
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['2020-02-10', '2020-02-11', '2020-02-12', '2020-02-13', '2020-02-14', '2020-02-15', '2020-02-16'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '',
            type: 'bar',
            barWidth: '60%',
            data: [100, 152, 200, 334, 390, 330, 220]
        }
    ]
  }
  this.histogramChart.setOption(options);
}  
}

