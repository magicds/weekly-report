import AV from 'leancloud-storage';
import moment from 'moment/min/moment.min.js';
import userApi from './user.js';

import throwError from './error.js';

/**
 * 根据日期获取周一和周日的date
 * @param {Date} d 指定的日期，省略则取当天
 */
function getStartEnd(d) {
  d = d || new Date();
  // 根据当天 获取周一和周日
  let date = moment(d)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  let day = date.isoWeekday();
  let startDate = date
    .clone()
    .subtract(day - 1, 'days')
    .toDate();
  // 结束时间直接取到下周一凌晨
  let endDate = date
    .clone()
    .add(8 - day, 'days')
    // .hour(23)
    // .minute(59)
    // .second(59)
    // .millisecond(999)
    .toDate();

  return {
    startDate: startDate,
    endDate: endDate
  };
}

var dataApi = {
  /**
   * 获取数据
   *
   * @param {String} cls 要查询的class名称
   * @param {Object/Array} conditions 查询条件
   * 每个成员格式为：
   * {
   *     action:'操作名称，可选值为equalTo、notEqualTo、greaterThan、greaterThanOrEqualTo、lessThan、lessThanOrEqualTo',
   *     field:'条件字段名称',
   *     value:'值'
   * }
   * @param {Object/Array} sorts 排序规则，如 [{"sort":"asc","field":"groupId"},{"sort":"desc","field":"memberIndex"}]
   * @returns
   */
  getData(cls, conditions, sorts) {
    let query = new AV.Query(cls);

    if (conditions) {
      if (!(conditions instanceof Array)) {
        conditions = [conditions];
      }
      conditions.forEach(function(item) {
        query[item.action](item.field, item.value);
      });
    }

    if (sorts) {
      if (!(sorts instanceof Array)) {
        sorts = [sorts];
      }

      sorts.forEach(function(item) {
        var sort = item.sort.toLowerCase();
        if (sort == 'asc') {
          item.field && query.addAscending(item.field);
        } else if (sort == 'desc') {
          item.field && query.addDescending(item.field);
        }
      });
    }

    return query.find().catch(throwError);
  },
  /**
   * 查询一段时间内的周报
   * @param {Date} startDate 开始时间
   * @param {Date} endDate 结束时间
   * @param {Object/Array} sorts 排序规则
   * @param {Boolean} isCurrUser 是否仅查询当前用户
   */
  getDataByRange(startDate, endDate, sorts, isCurrUser) {
    let conditions = [
      {
        action: 'greaterThanOrEqualTo',
        field: 'updatedAt',
        value: startDate
      },
      {
        action: 'lessThanOrEqualTo',
        field: 'updatedAt',
        value: endDate
      }
    ];
    if (isCurrUser) {
      conditions.push({
        action: 'equalTo',
        field: 'userId',
        value: userApi.getCurrUser().id
      });
    }
    return this.getData('Logs', conditions, sorts);
  },
  /**
   * 查询本周的周报
   * @param {Object/Array} sorts 排序规则
   * @param {Boolean} isCurrUser 是否仅查询当前用户
   */
  getCurrWeekData(sorts, isCurrUser) {
    let { startDate, endDate } = getStartEnd();

    return this.getDataByRange(startDate, endDate, sorts, isCurrUser);
  },
  /**
   * 新增数据
   * @param {String} cls 存储class名称
   * @param {Object} data 存储数据
   */
  addData(cls, data) {
    let ObjCls = AV.Object.extend(cls);
    let obj = new ObjCls();
    let key;
    for (key in data) {
      if (data.hasOwnProperty(key)) {
        obj.set(key, data[key]);
      }
    }
    // 添加Acl权限
    this.addReortAcl(obj);
    return obj
      .save()
      .then(data => {
        console.log(cls + '已经创建', data);
      })
      .catch(throwError);
  },
  /**
   * 为新增的帖子添加权限
   * 设置自己可以写、管理员可写
   * @param {Object} report 当前要提交的对象
   */
  addReortAcl(report) {
    let reportAcl = new AV.ACL();

    reportAcl.setPublicReadAccess(true);
    reportAcl.setRoleWriteAccess('administrator', true);
    reportAcl.setWriteAccess(userApi.getCurrUser(), true);

    report.setACL(reportAcl);
  },
  //  检查本周是否已经填写
  checkIsSubmit() {
    return this.getCurrWeekData(undefined, true).catch(throwError);
  },
  // 提交周报
  addReprot(report) {
    let data = {};
    // 自动为数据加入当前用户
    let user = userApi.getCurrUser();
    data.userId = user.id;
    data.report = JSON.stringify(report);

    return this.addData('Logs', data);
  },
  updateReport(id, report) {
    let obj = AV.Object.createWithoutData('Logs', id);

    obj.set('report', JSON.stringify(report));

    return obj.save();
  }
};

export default dataApi;
