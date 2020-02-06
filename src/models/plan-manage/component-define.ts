export class ComponentDefine {
  name: string = '';
  editTime: string = '';
  id: string = '';
  key: string = '';
  layout: any = {};
  extraInfo: any = {};
  data: any = {};
  rules: any = {};
  conditions: any = [];
  widgets: any[] = [];
  widgetCount: number = 0;
  planCellId: string = '';
  options: any = {
    showTitle: true
  };
  onDataChange!: any;
}
