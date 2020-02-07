import { getGuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import epidemicDynamicStyle from './epidemic-dynamic.module.scss';
import epidemicDynamicHtml from './epidemic-dynamic.html';
import { ECharts, EChartOption } from 'echarts';
import * as echarts from 'echarts';
import 'echarts/map/js/china.js';
import 'echarts/map/js/province/hubei.js';
import { EpidemicInfoFormComponent } from './epidemic-info-form/epidemic-info-form';
import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import EpidemicPerson from '@/models/home/epidemic-persion';
import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import moment from 'moment';

@Component({
  template: epidemicDynamicHtml,
  style: epidemicDynamicStyle,
  themes: [{ name: 'white', style: epidemicDynamicStyle }],
  components: {
    'side-frame': SideFrameComponent,
    'epidemic-info-form': EpidemicInfoFormComponent
  }
})
export class EpidemicDynamicComponent extends Vue {
  chart!: ECharts;
  option!: any;

  mapChart!: ECharts;
  mapOption!: any;

  isShowTabs: boolean = false;

  epidemicPersonList: EpidemicPerson[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  keyWords: string = '';

  // 当前省疫情数据
  curProEpidemicData: any = {};

  citiesEpidemicData: any[] = [];

  async mounted() {
    console.log(this.epidemicPersonList);
    await this.queryProvinceEpidemicData();
    await this.queryCityEpidemicData();
    console.log(this.curProEpidemicData);
    console.log(this.citiesEpidemicData);
    const ele: HTMLDivElement = document.querySelector('#doughnut') || document.createElement('div');
    this.chart = echarts.init(ele);
    this.setOption();

    const mapEle: HTMLDivElement = document.querySelector('#map') || document.createElement('div');
    this.mapChart = echarts.init(mapEle);
    this.setMapOption();
    this.queryEpidemicPersons();
    this.intervalQueryEpidemicData();
  }

  async queryProvinceEpidemicData() {
    this.curProEpidemicData = await epidemicDynamicService.queryProvinceEpidemicData();
  }

  async queryCityEpidemicData() {
    this.citiesEpidemicData = await epidemicDynamicService.queryCityEpidemicData();
  }

  /**
   * 间断获取疫情数据
   */
  intervalQueryEpidemicData() {
    setInterval(() => {
      this.queryProvinceEpidemicData();
      this.queryCityEpidemicData().then(() => {
        this.setMapOption();
      });
    }, 60000);
  }

  async queryEpidemicPersons() {
    const data = await epidemicDynamicService.queryEpidemicPersons(this.currentPage - 1, this.pageSize);
    console.log('---queryEpidemicPersons---');
    this.totalCount = data.count;
    this.epidemicPersonList = data.value;
    console.log(data);
  }

  setOption() {
    this.option = {
      xAxis: {
        type: 'category',
        data: ['关山春小', '关南小区', '软件园', '曙光新城']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70],
          type: 'bar'
        }
      ]
    };
    this.chart.setOption(this.option);
  }

  setMapOption() {
    const citiesData: any = [];
    this.citiesEpidemicData.forEach(e => {
      if (e.name === '神农架地区') {
        e.name = '神农架林区';
      } else if (e.name.startsWith('恩施')) {
        e.name = '恩施土家族苗族自治州';
      } else {
        e.name = e.name + '市';
      }
      const data: any = {
        name: e.name,
        value: e.confirm
      };
      citiesData.push(data);
    });
    console.log(citiesData);
    this.mapOption = {
      // backgroundColor: '#404a59',
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        type: 'piecewise',
        pieces: [
          { min: 10000, label: '>10000', color: '#660208' },
          { min: 1000, max: 9999, label: '1000-9999', color: '#8C0D0D' },
          { min: 100, max: 999, label: '100-999', color: '#CC2929' },
          { min: 10, max: 99, label: '10-99', color: '#FF7B69' },
          { min: 1, max: 9, label: '1-9', color: '#FFAA85' }
        ],
        min: 1,
        max: 20000,
        bottom: 20,
        calculable: true,
        inRange: {
          color: ['#eea61c', '#d76b32', '#db3838']
        }
        // textStyle: {
        //   color: '#fff'
        // }
      },
      series: [
        {
          name: '确诊病例',
          type: 'map',
          map: '湖北',
          roam: false,
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: false
            }
          },

          itemStyle: {
            emphasis: {
              label: {
                show: true
              }
            }
          },
          zoom: 1,
          data: citiesData
        }
      ]
    };
    this.mapChart.setOption(this.mapOption);
  }

  showTabs() {
    this.isShowTabs = !this.isShowTabs;
    if (this.isShowTabs) {
      this.queryEpidemicPersons();
    }
  }

  addEpidemicPersion() {
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.open();
  }

  savePersonSuccess() {
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.close();
    this.queryEpidemicPersons();
  }

  handleSizeChange(val: any) {
    this.pageSize = val;
    this.queryEpidemicPersons();
    console.log(`每页 ${val} 条`);
  }
  handleCurrentChange(val: any) {
    this.currentPage = val;
    this.queryEpidemicPersons();
    console.log(`当前页: ${val}`);
  }
}
