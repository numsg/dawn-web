import dealDocument from '@/utils/deal-document';

// 打印类属性、方法定义
class Print {
  dom: any;
  options: any;
  callback?: Function;
  constructor(dom: any, options?: any, callback?: Function) {
    if (!(this instanceof Print)) {
      return new Print(dom, options, callback);
    }
    this.dom = dom;
    this.options = options;
    this.callback = callback;
  }

  async init() {
    const style = await this.getStyle();
    const html = this.getHtml();
    const content = style + html;
    this.writeIframe(content);
    // this.writeIframe(html);
  }

  extend(obj: any, obj2: any) {
    // tslint:disable-next-line:forin
    for (const k in obj2) {
      obj[k] = obj2[k];
    }
    return obj;
  }

  async getStyle() {
    let str = '';
    // str += '<style type="text/css">' + elementCss + '</style>';
    if (this.options.cssName) {
      const styleList = document.querySelectorAll('style');
      const styles: any[] = Array.prototype.slice.call(styleList);
      const index = styles.findIndex((e: any) => e.innerHTML.indexOf('.' + this.options.cssName + '-module') !== -1);
      const stylus: any[] = [];
      styles.forEach((e: any, i: any) => {
        if (i >= index) {
          stylus.push(e);
        }
      });
      for (let i = 0; i < stylus.length; i++) {
        str += stylus[i].outerHTML;
      }
    }
    const styleList = document.querySelectorAll('style');
    for (let i = 0; i < styleList.length; i++) {
      str += styleList[i].outerHTML;
    }
    // tslint:disable-next-line: quotemark
    str +=
      // tslint:disable-next-line: quotemark
      "<style type='text/css' media='print'>" + (this.options.noPrint ? this.options.noPrint : '.no-print') + '{display:none;}</style>';
    // tslint:disable-next-line: quotemark
    // str += "<style type='text/css'>" + ` @charset "UTF-8"; html,  body,  #app { overflow-x: visible !important; } ` + "</style>";
    str +=
      // tslint:disable-next-line:quotemark
      "<style type='text/css' media='print'>" + ` @charset "UTF-8"; html,  body,  #app { overflow: visible !important; } ` + '</style>';
    return str;
  }

  getHtml() {
    // const inputs = document.querySelectorAll('input');
    // const textareas = document.querySelectorAll('textarea');
    // for (let k = 0; k < inputs.length; k++) {
    //   if (inputs[k].type === 'checkbox' || inputs[k].type === 'radio') {
    //     if (inputs[k].checked === true) {
    //       inputs[k].setAttribute('checked', 'checked');
    //     } else {
    //       inputs[k].removeAttribute('checked');
    //     }
    //   } else if (inputs[k].type === 'text') {
    //     inputs[k].setAttribute('value', inputs[k].value);
    //   } else {
    //     inputs[k].setAttribute('value', inputs[k].value);
    //   }
    // }

    // for (let k2 = 0; k2 < textareas.length; k2++) {
    //   if (textareas[k2].type === 'textarea') {
    //     textareas[k2].innerHTML = textareas[k2].value;
    //   }
    // }
    dealDocument.dealHtml();
    const selects = document.querySelectorAll('select');
    for (let k3 = 0; k3 < selects.length; k3++) {
      if (selects[k3].type === 'select-one') {
        const child: any = selects[k3].children;
        for (const i in child) {
          if (child[i].tagName === 'OPTION') {
            if (child[i].selected === true) {
              child[i].setAttribute('selected', 'selected');
            } else {
              child[i].removeAttribute('selected');
            }
          }
        }
      }
    }

    return this.dom.outerHTML;
  }

  writeIframe(content: any) {
    const iframe: any = document.createElement('iframe');
    iframe.id = 'myIframe';
    iframe.setAttribute('style', 'position: absolute; top: -999px; left: -999px; width:0;height:0;border:0');
    iframe.setAttribute('wmode', 'Opaque');
    let frameWindow: any = document.body.appendChild(iframe);
    frameWindow = frameWindow.contentWindow || frameWindow.contentDocument || frameWindow;
    const wdoc = frameWindow.document || frameWindow.contentDocument || frameWindow;
    // wdoc.open();
    wdoc.write('<!doctype html>');
    wdoc.write(content);
    wdoc.close();
    // const self = this;
    // frameWindow.onload = function () {
    //   self.printCallback(frameWindow, iframe);
    // };
    setTimeout(() => {
      this.printCallback(frameWindow, iframe);
    }, 1200);
  }

  printCallback(frameWindow: any, iframe: any) {
    this.toPrint(frameWindow);
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 100);
  }

  toPrint(frameWindow: any) {
    try {
      setTimeout(() => {
        // frameWindow.focus();
        document.body.focus();
        try {
          if (!frameWindow.document.execCommand('print', false, null)) {
            frameWindow.print();
          }
        } catch (e) {
          frameWindow.print();
        }
        frameWindow.close();
        if (this.callback) {
          this.callback();
        }
      }, 10);
    } catch (err) {
      console.log('err', err);
    }
  }
  isDOM(obj: any) {
    if (typeof HTMLElement === 'object') {
      return obj instanceof HTMLElement;
    } else {
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }
  }
}

export const printUtil = (dom: any, options?: any, callback?: Function) => {
  const obj = new Print(dom, options, callback);
  obj.options = obj.extend(
    {
      noPrint: '.no-print'
    },
    options
  );
  obj.init();
};
export default printUtil;
