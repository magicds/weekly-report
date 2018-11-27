<template>
  <div>请选择查看范围
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

    <p v-if="targetDateRange">{{targetDateRange}}</p>

    <i-button @click="search">查询</i-button>

    <my-summary v-if="isShow" :data="weekReports" :export-name="fileName" :isloading="isloading"></my-summary>
  </div>
</template>

<script>
import moment from "moment/min/moment.min.js";
import mySummary from "./summary/summary.vue";
import { Select, Option, OptionGroup } from "iview/src/components/select";
import Button from "iview/src/components/button/";
import DatePicker from "iview/src/components/date-picker/";
import { getDateRange, getPrevDateRange } from "@/util/getDateRange.js";

const REPORT_START_DATE = new Date(2017, 6, 1);

const genderOptList = () => {
  const dateRangeMap = {};
  const startYear = REPORT_START_DATE.getFullYear();
  const startMonth = REPORT_START_DATE.getMonth() + 1;

  const n = new Date();
  const currYear = n.getFullYear();
  const currMonth = n.getMonth() + 1;

  const yearArr = [];

  let i = startYear;
  while (i <= currYear) {
    yearArr.push(i);
    i++;
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
    } else {
      monthOpt.list = getMonths(currYear);
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
      while (i <= len) {
        let t = `${year}-${(i + "").padStart(2, 0)}`;
        dateRangeMap[t] = getDateRange(t, "month");
        arr.push({ id: t, text: t });
        i++;
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
    } else {
      quarterOpt.list = getQuarter(currYear);
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
      while (i <= len) {
        let t = `${year}年第${i}季度`;
        let m = ((i - 1) * 3 + 1 + "").padStart(2, 0);
        dateRangeMap[t] = getDateRange(`${year}-${m}`, "quarter");
        arr.push({ id: t, text: t });
        i++;
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
        isloading: false
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
    targetDateRange() {
      return this.currOption === "week" ? this.date : this.selectedDateRange;
    },
    fileName() {
      return (
        moment(this.targetDateRange[0]).format("MM.DD") +
        "~" +
        moment(this.targetDateRange[1]).format("MM.DD") +
        "周报"
      );
    }
  },
  methods: {
    search() {
      const range = this.targetDateRange;
      const t1 = range[0].getTime();
      const t2 = range[1].getTime();
      const data = mockData.filter(item => {
        const s = +new Date(item.startDate);
        const e = +new Date(item.endDate);
        return s >= t1 && e <= t2;
      });

      let reports = [];

      // TODO 多条记录时需要按照人员进行合并
      data.forEach(item => {
        // const r = item.reports;
        reports = reports.concat(item.reports);
      });
      this.$set(this, "weekReports", reports);
      this.isShow = true;
    }
  }
};
const mockData = JSON.parse(localStorage.getItem("testData"));
</script>

