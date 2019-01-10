<template>
  <div class="group-report">
    <div>
      <span>按周汇总：</span>
      <span class="range-select">
        <i-select @on-change="hanleWeekChange" v-model="selectedWeek">
          <i-option :key="item.id" :value="item.id" v-for="item in weekList">{{ item.text }}</i-option>
        </i-select>
      </span>
    </div>
    <GroupSummary :reports="weekReports" :timeScope="selectedWeekText" ref="weekSummary" v-if="weekReports.length"></GroupSummary>
    <div class="empty-tips" v-else>暂无数据</div>
    <div style="margin-top: 30px;">
      <span>按月汇总：</span>
      <span class="range-select">
        <i-select @on-change="hanleMonthChange" v-model="selectedMonth">
          <i-option :key="item.id" :value="item.id" v-for="item in monthList">{{ item.text }}</i-option>
        </i-select>
      </span>
    </div>
    <GroupSummary :reports="monthReports" :timeScope="selectedMonthText" ref="monthSummary" v-if="monthReports.length"></GroupSummary>
    <div class="empty-tips" v-else>暂无数据</div>
    <i-button @click="exportHtml" type="primary" :disabled="!!(!monthReports.length && !weekReports.length)">导出</i-button>
  </div>
</template>
<script>
import Button from 'iview/src/components/button/button';
import { Select, Option } from 'iview/src/components/select';
import GroupSummary from '../components/GroupSummary';
import dateUtil from '@/util/date';
import throwError from '@/api/error.js';
import AV from 'leancloud-storage';
import { download } from '../components/summary/exportData.js';
export default {
  components: {
    GroupSummary,
    'i-button': Button,
    'i-select': Select,
    'i-option': Option
  },
  data() {
    return {
      weekList: (() => {
        const d = new Date();
        const arr = [];
        for (let i = 0; i < 6; i++) {
          const date = d.getDate();
          d.setDate(date - 7 * i);
          const text = dateUtil.getWeekText(d);
          arr.push({
            id: text,
            text: text
          });
        }
        arr[0].text = '本周';
        arr[1].text = '上周';
        return arr;
      })(),
      selectedWeek: '',
      selectedWeekText: '',
      monthList: (() => {
        function getMonthText(date) {
          return `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, 0)}`;
        }
        const d = new Date();
        d.setDate(1);
        const arr = [];
        for (let i = 0; i < 6; i++) {
          const m = d.getMonth();
          d.setMonth(m - 1 * i);
          const text = getMonthText(d);
          arr.push({
            id: text,
            text: text
          });
        }
        arr[0].text = '本月';
        arr[1].text = '上月';
        return arr;
      })(),
      selectedMonth: '',
      selectedMonthText: '',
      weekReports: [],
      monthReports: []
    };
  },
  mounted() {
    this.selectedWeek = this.weekList[0].id;
    this.selectedMonth = this.monthList[0].id;
    this.selectedWeekText = this.weekList[0].text;
    this.selectedMonthText = this.monthList[0].text;
  },
  methods: {
    hanleWeekChange() {
      for (let o of this.weekList) {
        if (o.id == this.selectedWeek) {
          this.selectedWeekText = o.text;
          break;
        }
      }
      this.getWeekData();
    },
    hanleMonthChange() {
      for (let o of this.monthList) {
        if (o.id == this.selectedMonth) {
          this.selectedMonthText = o.text;
          break;
        }
      }
      this.getMonthData();
    },
    getWeekData() {
      const query = new AV.Query('GroupWeekLog');
      query.equalTo('title', this.selectedWeek);
      query.include('group');
      return query
        .find()
        .then(r => {
          if (r.length) {
            this.$set(this, 'weekReports', JSON.parse(JSON.stringify(r)));
          } else {
            this.$set(this, 'weekReports', []);
          }
        })
        .catch(throwError);
    },
    getMonthData() {
      const query = new AV.Query('GroupMonthLog');
      query.equalTo('title', this.selectedMonth);
      query.include('group');
      return query
        .find()
        .then(r => {
          if (r.length) {
            this.$set(this, 'monthReports', JSON.parse(JSON.stringify(r)));
          } else {
            this.$set(this, 'monthReports', []);
          }
        })
        .catch(throwError);
    },
    exportHtml() {
      const styleText = '';
      if (this.weekReports.length) {
        const weekTitle = `【${this.selectedWeek}】周汇总.html`;
        let weekData = this.$refs.weekSummary.$el.outerHTML;
        download(this.wrapAsHtml(weekData, weekTitle), weekTitle, false);
      }
      if (this.monthReports.length) {
        let monthData = this.$refs.monthSummary.$el.outerHTML;
        let monthTitle = `【${this.selectedMonth}】月汇总.html`;
        download(this.wrapAsHtml(monthData, monthTitle), monthTitle, false);
      }
    },
    wrapAsHtml(content, title) {
      return `<!DOCTYPE html><html><head><style>.ivu-progress {display:inline-block;}</style><title>${title}</title></head><body>${content}</body></html>`;
    }
  }
};
</script>

<style scoped>
.range-select {
  display: inline-block;
  width: 180px;
}
.empty-tips {
  color: #666;
  font-size: 14px;
  line-height: 40px;
  text-align: center;
}
</style>


