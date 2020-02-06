export class SystemConfig {
  id: string = '';
  name: string = '';
  description: string = '';
  key: string = '';
  pid: string = '';
  type: string = '';
  value: string = '';
  children:  Array<SystemConfig> = [];
}
export default SystemConfig;
