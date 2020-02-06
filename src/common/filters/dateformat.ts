
export const formatDate = (d: Date, format: string) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return format.replace(/(YYYY)|(yyyy)/, formatNumber(year))
                 .replace(/(MM)|(mm)/, formatNumber(month))
                 .replace(/(DD)|(dd)/, formatNumber(day))
                 .replace(/(HH)|(hh)/, formatNumber(hour))
                 .replace(/(mm)|(mm)/, formatNumber(minute))
                 .replace(/(SS)|(ss)/, formatNumber(second))
                 .replace(/\[|\]/g, '');
};

const formatNumber = (n: number) => {
    const s = n.toString();
    return s[1] ? s : '0' + s;
};

export const DATE_PICKER_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

