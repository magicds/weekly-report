<template>
  <div class="group-report">
    <h2>{{this.getTitle()}}</h2>
    <slot v-bind:cloneData="cloneData">
      <div :key="report.objectId" class="group-report-item" v-for="report in cloneData">
        <h3>{{report.group.name}}</h3>
        <div class="summary-area">
          <fieldset>
            <legend>管理情况</legend>
            <div>
              <ul>
                <li :key="index" v-for="(item,index)  in report.managementArr">{{item}}</li>
              </ul>
            </div>
          </fieldset>
          <fieldset>
            <legend>工作情况</legend>
            <div>
              <ul>
                <li :key="index" class="task-item" v-for="(item,index)  in report.taskSummary">
                  <span class="state">【{{item.state}}】</span>
                  <span class="name">{{item.name}}</span>
                  <span class="task-progress">
                    <i-progress :percent="item.progress" status="active"></i-progress>
                  </span>
                </li>
              </ul>
            </div>
          </fieldset>
        </div>
      </div>
    </slot>
    <div class="report-charts" ref="chart" style="height:300px;" v-show="chartReports.length"></div>
    <div class="empty-tips" v-if="!hasData">暂无数据</div>
  </div>
</template>

<script>
import Progress from 'iview/src/components/progress';
import renderChart from './chart.js';
export default {
  components: {
    'i-progress': Progress
  },
  props: {
    unitScope: {
      type: String,
      default: '周'
    },
    timeScope: {
      type: String,
      default: '本周'
    },
    reports: {
      type: Array,
      default: () => {
        return [];
      }
    },
    chartReports: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      hasData: this.reports.length || this.chartReports.length,
      cloneData: this.dealData(this.reports),
      chartData: this.dealChartData(this.chartReports)
    };
  },
  watch: {
    reports() {
      this.$set(this, 'cloneData', this.dealData(this.reports));
      this.hasData = this.reports.length || this.chartReports.length;
    },
    chartReports() {
      this.$set(this, 'chartData', this.dealChartData(this.chartReports));
      this.hasData = this.reports.length || this.chartReports.length;
    },
    chartData() {
      this.$nextTick(() => {
        this.renderChart();
      });
    }
  },
  methods: {
    getTitle() {
      let range = this.timeScope.length === 2 ? this.timeScope.substr(0, 1) : this.timeScope;
      // {{timeScope}}{{unitScope}}工作情况汇总
      return `${range}${this.unitScope}工作情况汇总`;
    },
    dealChartData(data) {
      const copyData = JSON.parse(JSON.stringify(data));
      const chartData = {
        title: this.timeScope,
        groups: [],
        done: [],
        delay: [],
        extra: []
      };
      const map = new Map();
      copyData.forEach(item => {
        map.set(item.group.name, item);
      });
      map.forEach(item => {
        let extraNum = 0;
        let doneNum = 0;
        let delayNum = 0;
        item.report.taskList.forEach(task => {
          if (task.type == 'new' || task.isExtra) {
            extraNum++;
          }
          if (task.progress == 100) {
            doneNum++;
          }
        });
        item.report.nextTasks.forEach(task => {
          if (task.type == 'postpone') {
            delayNum++;
          }
          if (task.isExtra) {
            extraNum++;
          }
        });

        const taskNum = extraNum + doneNum + delayNum || 1;

        chartData.groups.push(item.group.name);
        chartData.extra.push(extraNum / taskNum);
        chartData.done.push(doneNum / taskNum);
        chartData.delay.push(delayNum / taskNum);
      });
      return chartData;
    },
    dealData(data) {
      const copyData = JSON.parse(JSON.stringify(data));
      return copyData.map(d => {
        const r = d.report;
        const arr = r.management.split(/(?:\n|\r\n|\r)/);
        d.managementArr = arr.map(item => {
          item = item.trim();
          if (item) {
            return item;
          }
        });
        r.taskList.forEach(t => {
          if (t.progress === 100) {
            t.state = '完成';
          }
        });
        const nextTasks = r.nextTasks.map(t => {
          if (t.progress === 100) {
            t.state = '完成';
          } else {
            t.state = `${100 - t.progress}% 延至下${this.unitScope}`;
          }
          return t;
        });
        d.taskSummary = r.taskList.concat(nextTasks);
        return d;
      });
    },
    renderChart() {
      if (!this.chartReports.length) {
        return;
      }
      this.$nextTick(() => {
        renderChart(this.$refs.chart, this.chartData);
      });
    }
  }
};
</script>
<style>
.empty-tips {
  color: #666;
  font-size: 14px;
  line-height: 40px;
  text-align: center;
}
</style>
<style scoped>
.task-item {
  line-height: 30px;
}
.task-progress {
  display: inline-block;
  vertical-align: top;
  width: 200px;
  margin-left: 10px;
}
.group-report,
fieldset {
  margin-bottom: 20px;
}
</style>
