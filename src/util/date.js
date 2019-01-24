const dateUtil = {
  getWeekText(d1) {
    // let day = d1.getDay();
    // day = day === 0 ? 7 : day;
    // const startDate = d1.getDate() - (day - 1);
    // const endDate = d1.getDate() + (7 - day);

    // const s = new Date(d1.getTime());
    // const e = new Date(d1.getTime());

    // s.setDate(startDate);
    // s.setHours(0, 0, 0, 0);
    // e.setDate(endDate);
    // e.setHours(23, 59, 59, 999);


    const s = dateUtil.getWeekStart(d1);
    const e = dateUtil.getWeekEnd(d1);

    return `${s.getFullYear()}-${(s.getMonth() + 1 + '').padStart(2, 0)}-${(s.getDate() + '').padStart(2, 0)}~${e.getFullYear()}-${(e.getMonth() + 1 + '').padStart(2, 0)}-${(e.getDate() + '').padStart(2, 0)}`;
  },

  getWeekStart(d1) {
    let day = d1.getDay();
    day = day === 0 ? 7 : day;
    const startDate = d1.getDate() - (day - 1);
    const s = new Date(d1.getTime());
    s.setDate(startDate);
    s.setHours(0, 0, 0, 0);

    return s;
  },

  getWeekEnd(d1) {
    let day = d1.getDay();
    day = day === 0 ? 7 : day;
    const endDate = d1.getDate() + (7 - day);
    const e = new Date(d1.getTime());
    e.setDate(endDate);
    e.setHours(23, 59, 59, 999);
    return e;
  },

  getMonthWeekRange(y, m) {
    let year, month;
    if (m === undefined) {
      const arr = y.split('-');
      year = parseInt(arr[0]);
      month = parseInt(arr[1]) - 1;
    } else {
      year = y;
      month = m;
    }

    let startDate = new Date(year, month, 1);
    // 下一月的一号往前一天即为当月的最后一天
    let endDate = new Date(year, month + 1, 0);
    const firstDay = startDate.getDay();

    // 当月的第一个星期一才是真正的开始 因此不是周一则需要往后7天
    if (firstDay !== 1) {
      startDate.setDate(startDate.getDate() + 7);
    }

    let s = dateUtil.getWeekStart(startDate);
    let e = dateUtil.getWeekEnd(endDate);

    let arr = [];

    while (s.getTime() < e.getTime()) {
      arr.push(dateUtil.getWeekText(s));
      s.setDate(s.getDate() + 7);
      s.setHours(23, 59, 59, 999);
    }

    return arr;
  }
}

export default dateUtil;
