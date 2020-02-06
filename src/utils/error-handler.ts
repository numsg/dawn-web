import store from '@/store';

/**
 * VUE异常处理
 *
 * @export
 * @param {*} err   error对象
 * @param {*} vm    vue本身
 * @param {*} info  info是vue特有的字符串
 */
export function errorHandler(err: any, vm: any, info: any) {
  console.log('-------------vue-error-start---------------');
  console.log(err);
  console.log(vm);
  console.log(info);
  console.log('--------------vue-error-end--------------');
  store.dispatch('HandleAnomalous', {
    err: err.message + err.stack,
    info: info
  });
}

/**
 * js全局异常处理
 *
 * @export
 * @param {*} message
 * @param {*} source
 * @param {*} line
 * @param {*} column
 * @param {*} error
 */
export function onError(message: any, source: any, line: any, column: any, error: any) {
  console.log('-------------global-error-start---------------');
  console.log(message);
  console.log(source);
  console.log(line);
  console.log(column);
  console.log(error);
  console.log('-------------global-error-end---------------');
  store.dispatch('HandleJSOnError', {
    error: message,
    data: source
  });
}
