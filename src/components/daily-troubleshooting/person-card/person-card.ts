import { Vue, Component, Prop } from 'vue-property-decorator';
import Html from './person-card.html';
import Style from './person-card.module.scss';

import eventNames from '@/common/events/store-events';

import { PersonInfo } from '@/models/daily-troubleshooting/person-info';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import { TroubleshootingInfoForm } from '@/components/daily-troubleshooting/troubleshooting-info-form/troubleshooting-info-form';

@Component({
  template: Html,
  style: Style,
  components: {
    'side-frame': SideFrameComponent,
    TroubleshootingInfoForm,
  }
})
export class PersonCard extends Vue {
    currentPage = 1;
    pageSizes = [10, 20, 30];
    pageSize = 0;

    @Prop({default: []})
    private personData!: PersonInfo[];

    @Prop({default: 0})
    private totalCount!: number;

    private currentPerson = new PersonInfo();
    private plans = [1111, 123, 1231, 1231, 1231,  1231, 1231, 1231];

    created() {
        this.pageSize = this.pageSizes[0];
    }

    // get personData() {
    //     return this.plans.map( (plan) =>  {
    //         const person = new PersonInfo();
    //         person.id = 'sdjflksjdjowelljsdljfskdkfjskld';
    //         person.code = 'Y9879723423';
    //         person.name = '李二';
    //         person.identificationNumber = '4208372983762612873';
    //         person.sex = '男';
    //         person.phone = '13283762376';
    //         person.address = '汉正街马上路';
    //         person.plot = '幸福里';
    //         person.building = '1栋';
    //         person.unitNumber = '2单元';
    //         person.roomNo = '201';
    //         person.bodyTemperature = '36.9';
    //         person.leaveArea = false;
    //         person.confirmed_diagnosis = '确诊';
    //         person.createTime = '2020:02:07 11:29:20';
    //         person.multiTenancy = '很多人';
    //         return person;
    //     });
    // }
    colorBodyTemperature(temperature: string) {
        const tem = parseFloat(temperature);
        if ( tem > 37 ) {
            return '#ee8240';
        } else if ( tem > 38 ) {
            return '#ce3636';
        } else {
            return '#9ab2e9';
        }
    }

    showDetail() {

    }

    handleCardClick() {

    }

    success() {
        this.$emit('refesh');
    }

    // 编辑
    edit(person: PersonInfo) {
        this.open();
        this.currentPerson = person;
    }
    // 页数码改变
    handleSizeChange(value: any) {
        this.pageSize = value;
        this.$emit( 'paginationChange', {pageSize: this.pageSize, currentPage: this.currentPage});
    }
    // 当前页改变
    handleCurrentChange(value: any) {
        this.currentPage = value;
        this.$emit( 'paginationChange', {pageSize: this.pageSize, currentPage: this.currentPage});
    }
    // 打开编辑
    open() {
        const sideFrame: any = this.$refs['sideFrame'];
        sideFrame.open();
    }
    // 关闭编辑
    colse() {
        const sideFrame: any = this.$refs['sideFrame'];
        sideFrame.colse();
    }
}
