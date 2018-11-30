import moment from 'moment/min/moment.min.js';
window.moment = moment;
/**
 * 获取向前推算日期范围
 *
 * @param {String} unit 单位 可选 week / month
 * @param {Number} size 往前推算多久
 * @returns {Array} 一个数组，第一个值为开始日期，第二个为结束日期，计算失败范围一个空数组
 */
function getPrevDateRange(unit, size) {
  let t = moment()
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  let day = t.isoWeekday();

  if (unit === 'week') {
    return [
      t
      .clone()
      .subtract(7 * size + day - 1, 'days')
      .toDate(),
      t.subtract(day, 'days').hour(23).minute(59).second(59).millisecond(999).toDate()
    ];
  }

  if (unit === 'month') {
    return (function () {
      let aim_m = moment(t.subtract(size, 'month'), 'YYYY-MM');
      let start = aim_m.clone().startOf('month');
      let start_day = start.isoWeekday();
      let end = aim_m.clone().endOf('month');
      let end_day = end.isoWeekday();

      return [
        start.add(start_day === 1 ? 0 : 7 - start_day + 1, 'days').toDate(),
        end.add(7 - end_day + 1, 'days').toDate()
      ];
    })();
  }
  return [];
}

function getStartOfMonth(t) {
  let start = t.clone().startOf('month');
  let start_day = start.isoWeekday();
  return start.add(start_day === 1 ? 0 : 7 - start_day + 1, 'days').hour(0).minute(0).second(0).millisecond(0).toDate();
}

function getEndOfMonth(t) {
  let end = t.clone().endOf('month');
  let end_day = end.isoWeekday();
  return end.add(7 - end_day, 'days').hour(23).minute(59).second(59).millisecond(999).toDate()
}

function getDateRange(dateStr, type) {
  let t = moment(dateStr, 'YYYY-MM-DD');
  let day = t.isoWeekday();

  if (type === 'week') {
    return [
      t.clone().hour(0).minute(0).second(0).millisecond(0).subtract(day - 1, 'days').toDate(),
      t.add(7 - day, 'days').hour(23).minute(59).second(59).millisecond(999).toDate()
    ];
  }

  if (type === 'month') {
    return [
      // 开始 除非是周一 否则往后
      getStartOfMonth(t),
      // end 除非是周日 否则向后
      getEndOfMonth(t)
    ];
  }

  if (type === 'quarter') {
    return (function () {
      // 根据季度 获取开始和结束月份 转化为月份的开始结束
      const quarter = t.clone().quarter();
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      const year = t.year();
      let start = moment(`${year}-${startMonth}`, 'YYYY-MM').startOf('month');
      let end = moment(`${year}-${endMonth}`, 'YYYY-MM').endOf('month');

      return [getStartOfMonth(start), getEndOfMonth(end)];
    })();
  }

  if (type === 'year') {
    return (function () {
      t = moment(dateStr, 'YYYY');
      let start = t.clone().startOf('year');
      let end = t.clone().endOf('year');

      return [getStartOfMonth(start), getEndOfMonth(end)];
    })();
  }

  return [];
}

function getMonday(d, asMoment) {
  let date = moment(d).hour(0).minute(0).second(0).millisecond(0);
  let day = date.isoWeekday();
  date = date.clone().subtract(day - 1, 'days');
  return asMoment ? date : date.toDate();
}

function getSunday(d, asMoment) {
  let date = moment(d).hour(23).minute(59).second(59).millisecond(999);
  let day = date.isoWeekday();
  date = date.clone().subtract(7 - day, 'days');
  return asMoment ? date : date.toDate();
}

export {
  getPrevDateRange,
  getDateRange,
  getMonday,
  getSunday
};
export default getDateRange;
