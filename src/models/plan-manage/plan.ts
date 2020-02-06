import { PlanOutline } from './plan-outline';
import DistrictLevel from '../template-manage/district-level';
import EventType from '../data-define/event-type';
import PlanUse from '../template-manage/plan-use';
import ResponseSub from '../template-manage/response-sub';

export class Plan {
  config: string = '{}';
  cover: string = '';
  createPerson: string = '';
  createTime: string = '';
  description: string = '';
  districtIds: string[] = [];
  districtLevel: DistrictLevel = new DistrictLevel();
  districtLevelId: string = '';
  eventType: EventType = new EventType();
  eventTypeId: string = '';
  id: string = '';
  isDefault: number = 0;
  name: string = '';
  planUse: PlanUse = new PlanUse();
  planUseId: string = '';
  responseSub: ResponseSub = new ResponseSub();
  responseSubId: string = '';
  status: number = 0;
  tag: any[] = [];
  type: number = 0;
  updatePerson: string = '';
  updateTime: string = '';
  version: string = '';
  matchDegree?: string = '';
  planOutLine?: any[] = [];
  isImport: boolean = false;
  multiTenancy: string = '';
}
export default Plan;
