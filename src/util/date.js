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
  }
}

export default dateUtil;
