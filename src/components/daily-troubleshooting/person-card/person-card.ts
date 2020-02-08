import { Vue, Component } from 'vue-property-decorator';
import Html from './person-card.html';
import Style from './person-card.module.scss';

import eventNames from '@/common/events/store-events';

import { PersonInfo } from '@/models/daily-troubleshooting/person-info';

@Component({
  template: Html,
  style: Style,
  components: {}
})
export class PersonCard extends Vue {
    currentPage = 1;
    pageSize = 2;
    totalCount = 10;

    private currentPerson = new PersonInfo();
    private plans = [1111, 123, 1231, 1231, 1231,  1231, 1231, 1231];
    get personData() {
        return this.plans.map( (plan) =>  {
            const person = new PersonInfo();
            person.id = 'sdjflksjdjowelljsdljfskdkfjskld';
            person.code = 'Y9879723423';
            person.name = '李二';
            person.identificationNumber = '4208372983762612873';
            person.sex = '男';
            person.phone = '13283762376';
            person.address = '汉正街马上路';
            person.plot = '幸福里';
            person.building = '1栋';
            person.unitNumber = '2单元';
            person.roomNo = '201';
            person.bodyTemperature = '36.9';
            person.leaveArea = false;
            person.confirmed_diagnosis = '确诊';
            person.createTime = '2020:02:07 11:29:20';
            person.multiTenancy = '很多人';
            return person;
        });
    }
    showDetail() {

    }

    handleCardClick() {

    }

    handleSizeChange() {

    }

    handleCurrentChange() {

    }
}
