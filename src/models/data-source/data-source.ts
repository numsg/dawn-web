import DataSourceCorrelation from './data-source-correlation';
import DSourceDataModel from './d-source-data';

export class DataSource {
  id: string = '';
  name: string = '';
  image: string = '';
  tag?: string = ''; // 标准tag
  type: number = 0;
  description: string = '';
  dSourceDataModels: Array<DSourceDataModel> = [];
  tags?: Array<DataSourceCorrelation> = []; // 用于展示的model tag
  data: Array<any> = [];
  originalId: string = '';
}
export default DataSource;
