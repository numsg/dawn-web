import systemLogService from '../api/system-log/system-log.service';

let NODE_ENV: any;
if (process.env.NODE_ENV === 'production') {
  // 为生产环境修改配置...
  NODE_ENV = 'hash';
} else {
  // 为开发环境修改配置...
  NODE_ENV = 'history';
}
export interface ILogger {
  info(msg: any): any;

  warn(msg: any): any;

  error(msg: any): any;
}

export class Logger implements ILogger {
  public info(msg: any) {
    this.handleWriteLog(msg);
  }

  public warn(msg: any) {
    this.handleWriteLog(msg);
  }

  public error(msg: any) {
    this.handleWriteLog(msg);
  }

  private handleWriteLog(msg: any) {
    if (NODE_ENV === 'history') {
      console.log(msg);
    } else {
      systemLogService.addSystemLog([msg]);
    }
  }
}
