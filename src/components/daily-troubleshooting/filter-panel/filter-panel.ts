import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Html from './filter-panel.html';
import styles from './filter-panel.module.scss';
import EventType from '@/models/data-define/event-type';
import DistrictLevel from '@/models/template-manage/district-level';
import ResponseSub from '@/models/template-manage/response-sub';
import { PlanUse } from '@/models/template-manage/plan-use';
import { getUuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
import { DATE_PICKER_FORMAT } from '@/common/filters/dateformat';
import moment from 'moment';
import notifyUtil from '@/common/utils/notifyUtil';
import eventNames from '@/common/events/store-events';
import { treeToArray } from '@/common/utils/utils';
import { Getter } from 'vuex-class';
import * as R from 'ramda';
import filterStyleBlackStyle from './filter-panel.black.module.scss';
import i18n from '@/i18n';
import District from '@/models/data-define/district';

@Component({
  name: 'pms-filter-panel',
  template: Html,
  style: styles,
  themes: [{ name: 'white', style: styles }, { name: 'black', style: filterStyleBlackStyle }]
})
export default class FilterPanelComponent extends Vue {
  activeName: string = '1';

  allEventTypes = [
    {label: '1231', checked: false, id: '123123', children: []}
  ];

  eventTypeTags = [];

  onTreeCheckChange() {

  }

}
