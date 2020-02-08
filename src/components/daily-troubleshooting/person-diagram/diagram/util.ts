export default class ColorUtil {

  /**
   * 将rgb颜色转成 hex
   * @param color
   */
  static rgbToHex(color: string) {
    const rgb = color.split(',');
    const r = parseInt(rgb[0].split('(')[1], 10);
    const g = parseInt(rgb[1], 10);
    const b = parseInt(rgb[2].split(')')[0], 10);
    // tslint:disable-next-line:no-bitwise
    const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
  }

  static getRGB(color: string) {
    const rgb = color.split(',');
    const r = parseInt(rgb[0].split('(')[1], 10);
    const g = parseInt(rgb[1], 10);
    const b = parseInt(rgb[2].split(')')[0], 10);
    return '(' + [r , g, b].map(e => e + 20 < 255 ? e + 20 : 255).join(',') + ', 0.8)';
  }

  /**
   * 将hex颜色转成 rgb
   * @param hex
   */
  static hexToRgba(hex: string) {
    return 'rgba(' + ColorUtil.hexToR(hex) + ',' + ColorUtil.hexToG(hex) + ',' + ColorUtil.hexToB(hex) + (ColorUtil.hexToA(hex) ?
     ',' + ColorUtil.hexToA(hex) : '' )  + + ')';
  }

  static isHex(hex: string) {
    return  ColorUtil.cutHex(hex).length >= 6;
  }

  /**
   * 将hex颜色转成 rgb
   * @param hex
   */
  static toRgba(hex: string) {
    return 'rgba(' + ColorUtil.hexToR(hex) + ',' + ColorUtil.hexToG(hex) + ',' + ColorUtil.hexToB(hex)  + ', 0.8)';
  }


  static newRgba(hex: string) {
    return 'rgba(' + ([ColorUtil.hexToR(hex), ColorUtil.hexToG(hex), ColorUtil.hexToB(hex)].map(e => e + 30 < 255 ?
       e + 30 : 255)).join(',') + (ColorUtil.hexToA(hex) ? ',' + ColorUtil.hexToA(hex) : '' ) + ')';
  }

  static cutHex(hex: string) {
    return hex.charAt(0) === '#' ? hex.substring(1, 7) : hex;
  }
  static hexToR(hex: string) {
    return parseInt((ColorUtil.cutHex(hex)).substring(0, 2), 16);
  }
  static hexToG(hex: string) {
    return parseInt((ColorUtil.cutHex(hex)).substring(2, 4), 16);
  }
  static hexToB(hex: string) {
    return parseInt((ColorUtil.cutHex(hex)).substring(4, 6), 16);
  }
  static hexToA(hex: string) {
    return parseInt((ColorUtil.cutHex(hex)).substring(6, 8), 16) || '';
  }


}
