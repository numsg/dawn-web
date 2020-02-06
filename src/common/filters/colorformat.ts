
/**
 * 根据名字转换颜色
 * @param name
 */
export const transformToColor = (name: string) => {
    let hash = 0;
    const len = name.length;
    if (len === 0) {
        return '#000';
    }
    for (let i = 0; i < len; i++) {
        // tslint:disable-next-line:no-bitwise
        hash = ((hash << 8) - hash) + name.charCodeAt(i);
        // tslint:disable-next-line:no-bitwise
        hash |= 0;
    }
    hash = Math.abs(hash);
    const res = '#' + hash.toString(16).substr(0, 6);
    // return '#' + hash.toString(16).substr(0, 6);
    return res;
};

export default transformToColor;
