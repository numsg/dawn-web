export default {
  formatTime(haomiaoTime: any) {
    let year, month, day, hour, minites, second;
    const startTimer = new Date(haomiaoTime);
    year = startTimer.getFullYear();
    month = startTimer.getMonth() + 1;
    day = startTimer.getDate();
    hour = startTimer.getHours();
    minites = startTimer.getMinutes();
    second = startTimer.getSeconds();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    if (hour < 10) {
      hour = '0' + hour;
    }
    if (minites < 10) {
      minites = '0' + minites;
    }
    if (second < 10) {
      second = '0' + second;
    }
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minites + ':' + second;
  }
};

export const copyObject = (val: any) => {
  if (val && typeof val === 'object') {
    return JSON.parse(JSON.stringify(val));
  }
  return undefined;
};
