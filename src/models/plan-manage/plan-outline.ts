import PlanCell from './plan-cell';
import PlanContent from './plan-content';

export class PlanOutline {
    id: string = '';
    name: string = '';
    planId: string = '';
    outLineLevel: string = '';
    pid: string = '';
    planCel: PlanCell = new PlanCell();
    planContentModel: PlanContent = new PlanContent();
    children: PlanOutline[] = [];
}

export default PlanOutline;

