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
    <GroupSummary unitScope="周" :chartReports="weekReports" :reports="weekReports" :timeScope="selectedWeekText" ref="weekSummary" v-if="weekReports.length"></GroupSummary>
    <div style="margin-top: 30px;">
      <span>按月汇总：</span>
      <span class="range-select">
        <i-select @on-change="hanleMonthChange" v-model="selectedMonth">
          <i-option :key="item.id" :value="item.id" v-for="item in monthList">{{ item.text }}</i-option>
        </i-select>
      </span>
    </div>
    <GroupSummary unitScope="月" :chartReports="monthWeekReports" :reports="monthReports" :timeScope="selectedMonthText" ref="monthSummary" v-if="monthReports.length || monthWeekReports.length"></GroupSummary>
    <i-button :disabled="!!(!monthReports.length && !(weekReports.length || !monthWeekReports.length))" @click="exportHtml" type="primary">导出</i-button>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts';
import Button from 'iview/src/components/button/button';
import { Select, Option } from 'iview/src/components/select';
import GroupSummary from '../components/GroupSummary/GroupSummary';
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
        let d;
        const arr = [];
        for (let i = 0; i < 6; i++) {
          d = new Date();
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
        let d;
        const arr = [];
        for (let i = 0; i < 12; i++) {
          d = new Date();
          d.setDate(1);
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
      monthReports: [],
      monthWeekRange: [],
      monthWeekReports: []
    };
  },
  mounted() {
    this.selectedWeek = this.weekList[0].id;
    this.selectedMonth = this.monthList[0].id;
    this.selectedWeekText = this.weekList[0].text;
    this.selectedMonthText = this.monthList[0].text;
    this.monthWeekRange = dateUtil.getMonthWeekRange(this.selectedMonth);

    this.chartResizeHandle = this.dealChartResize();
    window.addEventListener('resize', this.chartResizeHandle, false);
  },
  beforeDestroy() {
    if (this.chartResizeHandle) {
      window.removeEventListener('resize', this.chartResizeHandle);
    }
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
      this.getMonthChartData();
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
    // 月度的统计数字是按照周计算的需要单独获取
    getMonthChartData() {
      const querys = this.monthWeekRange.map(week => {
        const query = new AV.Query('GroupWeekLog');
        query.equalTo('title', week);
        return query;
      });
      const query = AV.Query.or(...querys);
      query.include('group');
      return query
        .find()
        .then(r => {
          const data = JSON.parse(JSON.stringify(r));
          let reportsMap = new Map();
          let reports = [];
          data.forEach(item => {
            const gName = item.group.name;
            const d = reportsMap.get(gName);
            if (!d) {
              reportsMap.set(gName, item);
            } else {
              d.report.taskList = d.report.taskList.concat(item.report.taskList);
              d.report.nextTasks = d.report.nextTasks.concat(item.report.nextTasks);
            }
          });

          reportsMap.forEach(item => {
            reports.push(item);
          });
          reportsMap = null;

          this.$set(this, 'monthWeekReports', reports);
        })
        .catch(err => {
          this.$set(this, 'monthWeekReports', []);
          throwError(err);
        });
    },
    exportHtml() {
      const styleText = '';
      if (this.weekReports.length) {
        const weekTitle = `【${this.selectedWeek}】周汇总.html`;
        let weekData = this.getHtmlContent(this.$refs.weekSummary.$el);
        download(this.wrapAsHtml(weekData, weekTitle), weekTitle, false);
      }
      if (this.monthReports.length || this.monthWeekReports.length) {
        let monthData = this.getHtmlContent(this.$refs.monthSummary.$el);
        let monthTitle = `【${this.selectedMonth}】月汇总.html`;
        download(this.wrapAsHtml(monthData, monthTitle), monthTitle, false);
      }
    },
    getHtmlContent(el) {
      const div = el.cloneNode(true);

      // 图表替换为图片
      let imgArr = [];
      [].slice.call(el.querySelectorAll('[_echarts_instance_]')).forEach(chart => {
        const base64 = chart.getElementsByTagName('canvas')[0].toDataURL('image/png');
        imgArr.push(base64);
      });
      [].slice.call(div.querySelectorAll('[_echarts_instance_]')).forEach((chart, i) => {
        const img = document.createElement('img');
        img.src = imgArr[i];
        const div = document.createElement('div');
        div.style.textAlign = 'center';
        div.style.margin = '20px 0';
        div.appendChild(img);
        chart.replaceWith(div);
      });
      imgArr = null;

      return div.outerHTML;
    },
    wrapAsHtml(content, title) {
      return `<!DOCTYPE html><html><head><style>.ivu-progress {display:inline-block;}</style><title>${title}</title></head><body>${content}</body></html>`;
    },
    dealChartResize() {
      let timer;

      return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          [].slice.call(this.$el.querySelectorAll('[_echarts_instance_]')).forEach(el => {
            const chart = echarts.getInstanceByDom(el);
            chart && chart.resize();
          });
        }, 50);
      };
    }
  }
};
</script>

<style scoped>
.range-select {
  display: inline-block;
  width: 180px;
}
</style>


