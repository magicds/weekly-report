<template>
  <div>
    <div class="report-toobar">请选择查看范围
      <i-select v-model="currOption" style="width:150px;">
        <i-option v-for="op in opetionList" :key="op.id" :value="op.id">{{op.text}}</i-option>
      </i-select>
      <DatePicker
        v-show="currOption==='week'"
        type="daterange"
        v-model="date"
        placement="bottom-start"
        placeholder="请选择一个时间段"
        :options="weekPreSetting"
      ></DatePicker>
      <i-select v-if="currOption!=='week'" v-model="selectedDateName" style="width:150px;">
        <OptionGroup
          v-if="dateRangeListOpt.hasGroup"
          v-for="(group, index) in dateRangeListOpt.list"
          :key="index"
          :label="group.text"
        >
          <i-option v-for="item in group.list" :key="item.id" :value="item.id">{{item.text}}</i-option>
        </OptionGroup>

        <i-option
          v-if="!dateRangeListOpt.hasGroup"
          v-for="item in dateRangeListOpt.list"
          :key="item.id"
          :value="item.id"
        >{{item.text}}</i-option>
      </i-select>

      <i-button @click="search" type="primary">查询</i-button>
      <span class="text-muted date-range-tips" v-if="targetDateRangeText">{{targetDateRangeText}}</span>
    </div>
    <h3 class="report-title text-center" v-show="isShow" v-if="reportTitle">{{reportTitle}}</h3>
    <my-summary
      v-if="isShow"
      :data="weekReports"
      :export-name="fileName"
      :isloading="isloading"
      :showDetail="showDetailList"
      :showDate="showDate"
    ></my-summary>
  </div>
</template>

<script>
import moment from "moment/min/moment.min.js";
import api from "@/api/index.js";
import mySummary from "@/components/summary/summary.vue";
import { Select, Option, OptionGroup } from "iview/src/components/select";
import Button from "iview/src/components/button/";
import DatePicker from "iview/src/components/date-picker/";
import { getDateRange, getPrevDateRange } from "@/util/getDateRange.js";
import Message from "iview/src/components/message";
const REPORT_START_DATE = new Date(2017,11,10);

const genderOptList = () => {
  const dateRangeMap = {};
  const startYear = REPORT_START_DATE.getFullYear();
  const startMonth = REPORT_START_DATE.getMonth() + 1;

  const n = new Date();
  const currYear = n.getFullYear();
  const currMonth = n.getMonth() + 1;

  const yearArr = [];

  let i = currYear;
  while (i >= startYear) {
    yearArr.push(i);
    i--;
  }

  // 是否分组
  const needGroup = yearArr.length > 1 ? true : false;

  // 可选月份
  const month = (() => {
    const monthOpt = { list: [], hasGroup: needGroup };

    if (needGroup) {
      yearArr.forEach(year => {
        monthOpt.list.push({
          id: year,
          text: year + "",
          list: getMonths(year)
        });
      });
      monthOpt.defaultValue = monthOpt.list[0].list[0].id;
    } else {
      monthOpt.list = getMonths(currYear);
      monthOpt.defaultValue = monthOpt.list[0].id;
    }
    return monthOpt;
    function getMonths(year) {
      const arr = [];
      let i = 1;
      let len = 12;
      if (year == startYear) {
        i = startMonth;
      }
      if (year == currYear) {
        len = currMonth;
      }
      while (len >= i) {
        let t = `${year}-${(len + "").padStart(2, 0)}`;
        dateRangeMap[t] = getDateRange(t, "month");
        arr.push({ id: t, text: t });
        len--;
      }

      return arr;
    }
  })();

  // 可选季度
  const quarter = (() => {
    const quarterOpt = { list: [], hasGroup: needGroup };
    const startQ = Math.ceil(startMonth / 3);
    const endQ = Math.ceil(currMonth / 3);

    if (needGroup) {
      yearArr.forEach(year => {
        quarterOpt.list.push({
          id: year,
          text: year + "",
          list: getQuarter(year)
        });
      });
      quarterOpt.defaultValue = quarterOpt.list[0].list[0].id;
    } else {
      quarterOpt.list = getQuarter(currYear);
      quarterOpt.defaultValue = quarterOpt.list[0].id;
    }

    function getQuarter(year) {
      const arr = [];
      let i = 1;
      let len = 4;
      if (year == startYear) {
        i = startQ;
      }
      if (year == currYear) {
        len = endQ;
      }
      while (len >= i) {
        let t = `${year}年第${len}季度`;
        let m = ((len - 1) * 3 + 1 + "").padStart(2, 0);
        dateRangeMap[t] = getDateRange(`${year}-${m}`, "quarter");
        arr.push({ id: t, text: t });
        len--;
      }

      return arr;
    }

    return quarterOpt;
  })();

  return {
    monthOpts: month,
    quarterOpts: quarter,
    yearOpts: {
      hasGroup: false,
      defaultValue: yearArr[0] + "",
      list: yearArr.map(y => {
        dateRangeMap[y] = getDateRange(y, "year");
        return { id: y + "", text: `${y}年` };
      })
    },
    dateRangeMap: dateRangeMap
  };
};

export default {
  name: "report",
  components: {
    "i-select": Select,
    "i-option": Option,
    OptionGroup,
    DatePicker,
    "my-summary": mySummary,
    "i-button": Button
  },
  data() {
    return Object.assign(
      {
        currOption: "week",
        startDate: REPORT_START_DATE,
        date: getPrevDateRange("week", 1),
        opetionList: [
          {
            id: "week",
            text: "周"
          },
          {
            id: "month",
            text: "月"
          },
          {
            id: "quarter",
            text: "季度"
          },
          {
            id: "year",
            text: "年"
          }
        ],
        weekPreSetting: {
          // 快捷选择
          shortcuts: [
            {
              text: "前一周",
              value() {
                return getPrevDateRange("week", 1);
              }
            },
            {
              text: "前两周",
              value() {
                return getPrevDateRange("week", 2);
              }
            },
            {
              text: "前三周",
              value() {
                return getPrevDateRange("week", 3);
              }
            },
            {
              text: "本月",
              value() {
                return getPrevDateRange("month", 0);
              }
            },
            {
              text: "上月",
              value() {
                return getPrevDateRange("month", 1);
              }
            }
          ],
          // 禁止选择超过今天的日期
          disabledDate(date) {
            // const day = date.getDay();
            // return day > 1 || (date > new Date());
            return date > new Date();
          }
        },
        selectedDateName: "",
        isShow: false,
        weekReports: [],
        isloading: false,
        // 是否显示工作详情
        showDetailList: false,
        // 是否显示提交日期
        showDate: false
      },
      genderOptList()
    );
  },
  computed: {
    dateRangeListOpt() {
      return this[this.currOption + "Opts"];
    },
    selectedDateRange() {
      return this.dateRangeMap[this.selectedDateName];
    },
    weekDateRange() {
      let start_v = moment(this.date[0]).clone();
      let end_v = moment(this.date[1]).clone();
      // 开始时间为所选日期所在的周一
      let start = start_v
        .clone()
        .subtract(start_v.isoWeekday() - 1, "days")
        .toDate();
      // 转化日期为所选日期所在的周日
      let day = end_v.isoWeekday();
      let end = end_v.clone();
      if (day === 1 && end_v.isAfter(start_v, "day")) {
        end = end.toDate();
      } else {
        end = end.add(7 - day + 1, "days").toDate();
      }
      return [start, end];
    },
    targetDateRange() {
      return this.currOption === "week"
        ? this.weekDateRange
        : this.selectedDateRange;
    },
    targetDateRangeText() {
      return (
        moment(this.targetDateRange[0]).format("YYYY年MM月DD日 HH:mm:ss") +
        " ~ " +
        moment(this.targetDateRange[1]).format("YYYY年MM月DD日 HH:mm:ss")
      );
    },
    fileName() {
      if (this.currOption == "week") {
        return `${this.dateRangeText}周报`;
      }
      return `[${this.reportTitle}](${this.dateRangeText})`;
    },
    dateRangeText() {
      // const type
      return (
        moment(this.targetDateRange[0]).format("YY.MM.DD") +
        "-" +
        moment(this.targetDateRange[1]).format("YY.MM.DD")
      );
    },
    reportTitle() {
      switch (this.currOption) {
        case "week":
          return `${this.dateRangeText}周报`;
        case "month":
          return `${moment(this.selectedDateName, "YYYY-MM").format(
            "YYYY年MM月"
          )}周报汇总`;
        case "quarter":
          return `${this.selectedDateName}周报汇总`;
        case "year":
          return `${this.selectedDateName}年周报汇总`;
        default:
          break;
      }
      return `${this.dateRangeText}周报`;
    }
  },
  watch: {
    currOption(v) {
      if (v === "week") {
        return;
      }
      this.selectedDateName = this.dateRangeListOpt.defaultValue;
    }
  },
  methods: {
    getData(t1, t2) {
      return api.getData(
        "Reports",
        [
          {
            action: "greaterThanOrEqualTo",
            field: "startDate",
            value: t1
          },
          {
            action: "lessThanOrEqualTo",
            field: "endDate",
            value: t2
          }
        ],
        { sort: "asc", field: "startDate" }
      );
    },
    search() {
      const range = this.targetDateRange;
      this.isloading = true;
      this.getData(range[0], range[1])
        .then(data => {
          this.isloading = false;
          if (data && data.length) {
            let reports = this.dealReportData(data);
            this.$set(this, "weekReports", reports);
            this.isShow = true;
          }else {
            this.isShow = false;
            Message.error({
              content: `未查询到指定范围内的周报！`,
              closable: true,
              duration: 10
            });
          }
        })
        .catch(err => {
          Message.error({
            content: `${err.code || ''} ${err.message}`,
            closable: true,
            duration: 30
          });
          this.isloading = false;
        });
    },
    dealReportData(data) {
      let reports = [];
      const weeks = data.length;
      if (weeks > 1) {
        reports = assignByPerson(data);
        this.showDetailList = false;
      } else {
        reports = data[0].attributes.reports;
        this.showDetailList = true;
      }

      // 组合排序标识 并 调整饱和度为平均饱和度
      reports.forEach(item => {
        item._index = item.groupIndex * 100 + item.memberIndex;
        if (item._weeks) {
          item.saturation = item.saturation / item._weeks;
        }
      });

      // 排序
      reports.sort((a, b) => {
        return a._index < b._index ? -1 : 1;
      });
      return reports;

      function assignByPerson(allRps) {
        const map = {};
        const arr = [];
        allRps.forEach(rp => {
          rp.attributes.reports.forEach(person => {
            const uid = person.userId;
            if (!map[uid]) {
              map[uid] = person;
              map[uid]._weeks = 1;
            } else {
              // 列表合并
              map[uid].workList = map[uid].workList.concat(person.workList);
              map[uid].leaveList = map[uid].leaveList.concat(person.leaveList);
              // 时间以及饱和度等进行累加
              map[uid].studyTime += person.studyTime;
              map[uid].taskTime += person.taskTime;
              map[uid].communicationTime += person.communicationTime;
              map[uid].leaveTime += person.leaveTime;
              map[uid].saturation += person.saturation;
              map[uid]._weeks++;
            }
          });
        });

        Object.keys(map).forEach(k => {
          arr.push(map[k]);
        });
        return arr;
      }
    }
  }
};
</script>

<style scoped>
.report-toobar {
  line-height: 32px;
}
.date-range-tips {
  line-height: 32px;
  margin-left: 20px;
  vertical-align: middle;
}
.report-title {
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>
