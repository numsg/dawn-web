// 切换皮肤
export const Skin = {
  changeTheme(themeValue: any) {
    const path = './themes/' + themeValue.toLowerCase() + '/themes.css';
    window.document.documentElement.setAttribute('data-theme', themeValue);
    this.loadCss(path);
  },
  // 切换肤色样式
  loadCss(path: string) {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.setAttribute('class', 'skinCss');
    link.href = path;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    if (head.lastChild) {
      const lastChild: any = head.lastChild;
      if (lastChild.className === 'skinCss') {
        head.replaceChild(link, lastChild);
      } else {
        head.appendChild(link);
      }
    }
  }
};
