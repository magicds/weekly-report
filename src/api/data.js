import AV from 'leancloud-storage'
import moment from 'moment'

import throwError from './error.js'

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
    let query = new AV.query(cls)

    if (conditions) {
      if (!(conditions instanceof Array)) {
        conditions = [conditions]
      }
      conditions.forEach(function (item) {
        query[item.action](item.field, item.value)
      })
    }

    if (sorts) {
      if (!(sorts instanceof Array)) {
        sorts = [sorts]
      }

      sorts.forEach(function (item) {
        var sort = item.sort.toLowerCase()
        if (sort == 'asc') {
          item.field && query.addAscending(item.field)
        } else if (sort == 'desc') {
          item.field && query.addDescending(item.field)
        }
      })
    }

    return query.find().catch(throwError)
  },
  /**
   * 查询本周的周报
   * @param {Object/Array} sorts 排序规则
   */
  getCurrWeekData(sorts) {
    // 根据当天 获取周一和周日
    let date = moment()
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
    let day = date.isoWeekday()
    let startDate = date
      .clone()
      .subtract(day - 1, 'days')
      .toDate()
    // 结束时间直接取到下周一凌晨
    let endDate = date
      .clone()
      .add(8 - day, 'days')
      // .hour(23)
      // .minute(59)
      // .second(59)
      // .millisecond(999)
      .toDate()

    console.log(startDate, endDate)

    let conditions = [{
        action: 'greaterThanOrEqualTo',
        field: 'updatedAt',
        value: startDate
      },
      {
        action: 'lessThanOrEqualTo',
        field: 'updatedAt',
        value: endDate
      }
    ]
    return this.getData('', sorts)
  },
  /**
   * 新增数据
   * @param {String} cls 存储class名称
   * @param {Object} data 存储数据
   */
  addData(cls, data) {
    let ObjCls = AV.extend(cls)
    let obj = new ObjCls()
    let key
    for (key in data) {
      if (data.hasOwnProperty(key)) {
        obj.set(key, data[key])
      }
    }

    return obj.save().catch(throwError)
  },
  addReprot(data) {
    // 自动为数据加入当前用户
    data.user = {
      id: '',
      name: '',
      group: ''
    }

    return this.addData('', data)
  }
}

export default dataApi
