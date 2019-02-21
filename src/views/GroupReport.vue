<template>
  <div class="group-report">
    <div>
      <span>按周汇总：</span>
      <span class="range-select">
        <i-select @on-change="hanleWeekChange" v-model="selectedWeek">
          <OptionGroup :key="month.id" :label="month.text" v-for="month in weekList">
            <i-option :key="item.id" :value="item.id" v-for="item in month.list">{{item.text}}</i-option>
          </OptionGroup>
        </i-select>
      </span>
      <span class="week-range-tips text-muted">{{selectedWeek}}</span>
    </div>

    <GroupSummary :chartReports="weekReports" :reports="weekReports" :timeScope="selectedWeekText" ref="weekSummary" unitScope="周" v-if="weekReports.length"/>
    <div class="empty-tips" v-if="!weekReports.length">暂无数据</div>
    <div style="margin-top: 30px;">
      <span>按月汇总：</span>
      <span class="range-select">
        <i-select @on-change="hanleMonthChange" v-model="selectedMonth">
          <i-option :key="item.id" :value="item.id" v-for="item in monthList">{{ item.text }}</i-option>
        </i-select>
      </span>
    </div>

    <GroupSummary :chartReports="monthWeekReports" :reports="monthReports" :timeScope="selectedMonthText" ref="monthSummary" unitScope="月">
      <div v-if="monthReports.length">
        <div :key="item.objectId" class="group-report-item" v-for="item in monthReports">
          <h3>{{item.group.name}}</h3>
          <div class="summary-area">
            <fieldset>
              <legend>管理情况</legend>
              <div>
                <ul>
                  <li :key="index" v-for="(item,index)  in item.managementArr">{{item}}</li>
                </ul>
              </div>
            </fieldset>
            <fieldset>
              <legend>本月计划</legend>
              <ul v-if="item.plans && item.plans.length">
                <li :key="index" class="task-item" v-for="(item,index)  in item.plans">
                  <span class="name">{{item.name}}</span>
                  <span class="task-progress">
                    <i-progress :percent="item.progress" status="active"></i-progress>
                  </span>
                </li>
              </ul>
              <div v-else>无相关数据</div>
            </fieldset>
            <fieldset>
              <legend>本月完成情况</legend>
              <ul v-if="item.taskList.length">
                <li :key="index" class="task-item" v-for="(item,index)  in item.taskList">
                  <span class="state">【{{item.state}}】</span>
                  <span class="name">{{item.name}}</span>
                  <span class="task-progress">
                    <i-progress :percent="item.progress" status="active"></i-progress>
                  </span>
                </li>
              </ul>
              <div v-else>无相关数据</div>
            </fieldset>
          </div>
        </div>
      </div>
    </GroupSummary>
    <i-button :disabled="!!(!monthReports.length && !(weekReports.length || !monthWeekReports.length))" @click="exportHtml" type="primary">导出</i-button>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts';
import Button from 'iview/src/components/button/button';
import { Select, Option, OptionGroup } from 'iview/src/components/select';
import Progress from 'iview/src/components/progress';
import GroupSummary from '../components/GroupSummary/GroupSummary';
import dateUtil from '@/util/date';
import throwError from '@/api/error.js';
import AV from 'leancloud-storage';
import { download } from '../components/summary/exportData.js';

function getMonthText(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, 0)}`;
}

export default {
  components: {
    GroupSummary,
    OptionGroup,
    'i-button': Button,
    'i-select': Select,
    'i-option': Option,
    'i-progress': Progress
  },
  data() {
    return {
      weekList: (() => {
        const getMonthIdText = date => {
          const year = date.getFullYear();
          const month = date.getMonth();
          return {
            id: `${year}-${(month + 1 + '').padStart(2, 0)}`,
            text: `${year}年${month + 1 + '月'}`
          };
        };
        const getMonthArray = () => {
          let i = 0;
          let arr = [];
          for (; i < 12; i++) {
            let date = new Date();
            date.setDate(1);
            date.setMonth(date.getMonth() - i);
            arr.push(getMonthIdText(date));
          }
          return arr;
        };
        const getMonthWeekList = month => {
          return dateUtil.getMonthWeekRange(month.id).map((item, index) => {
            return {
              text: `${month.text}第${index + 1}周`,
              id: item
            };
          });
        };

        const arr = getMonthArray().map(month => {
          return {
            id: month.id,
            text: month.text,
            list: getMonthWeekList(month)
          };
        });

        // 过滤掉超过当前日期的
        const currWeekText = dateUtil.getWeekText(new Date());
        let finded = false;
        for (let i = 0, len = arr[0].list.length; i < len; i++) {
          let week = arr[0].list[i];
          if (week.id === currWeekText) {
            arr[0].list.splice(i + 1, len);
            finded = true;
            break;
          }
        }

        // 如果当前日期不在最新月份的列表中 则表示当前日期是计算在上一周的
        // 当前月无须保留 最后再补上一月
        if (!finded) {
          arr.shift();
          const date = new Date();
          date.setDate(1);
          date.setMonth(date.getMonth() - 12);
          const addMonth = getMonthIdText(date);
          arr.push({
            id: addMonth.id,
            text: addMonth.text,
            list: getMonthWeekList(addMonth)
          });
        }

        return arr;
      })(),
      selectedWeek: '',
      selectedWeekText: '',
      monthList: (() => {
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
    const len = this.weekList[0].list.length;
    this.selectedWeek = this.weekList[0].list[len - 1].id;
    this.selectedMonth = this.monthList[0].id;
    this.selectedWeekText = this.weekList[0].text;
    // this.selectedMonthText = this.monthList[0].text;
    this.updateSelectedWeekText();
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
      this.updateSelectedWeekText();
      this.getWeekData();
    },
    updateSelectedWeekText() {
      for (let m of this.weekList) {
        for (let o of m.list) {
          if (o.id == this.selectedWeek) {
            this.selectedWeekText = o.text;
          }
        }
      }
    },
    hanleMonthChange() {
      for (let o of this.monthList) {
        if (o.id == this.selectedMonth) {
          this.selectedMonthText = o.text;
          break;
        }
      }
      this.monthWeekRange = dateUtil.getMonthWeekRange(this.selectedMonth);
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
      // 本月
      const currMonthQuery = new AV.Query('GroupMonthLog');
      currMonthQuery.equalTo('title', this.selectedMonth);
      // 上月
      const dateArr = this.selectedMonth.split('-');
      const prevDate = new Date(dateArr[0], parseInt(dateArr[1] - 1, 10), 1);
      prevDate.setMonth(prevDate.getMonth() - 1);
      const prevMonthQuery = new AV.Query('GroupMonthLog');
      prevMonthQuery.equalTo('title', getMonthText(prevDate));
      // console.log(prevMonthQuery);

      // 构建查询
      const query = AV.Query.or(currMonthQuery, prevMonthQuery);
      query.include('group');
      return query
        .find()
        .then(r => {
          if (r.length) {
            this.$set(this, 'monthReports', this.dealMonthReoprts(JSON.parse(JSON.stringify(r))));
          } else {
            this.$set(this, 'monthReports', []);
          }
        })
        .catch(throwError);
    },
    // 汇总月报的数据
    dealMonthReoprts(data) {
      const currMonth = [];
      const prevMonth = [];
      // 分离当月和上月
      data.forEach(item => {
        if (item.title == this.selectedMonth) {
          currMonth.push(item);
        } else {
          prevMonth.push(item);
        }
      });
      if (!currMonth.length) {
        return [];
      }

      // 按组归档
      const groupMap = new Map();
      currMonth.forEach(r => {
        groupMap.set(r.group.objectId, r);
        r.managementArr = r.report.management.split(/(?:\n|\r\n|\r)/).map(managementItem => {
          managementItem = managementItem.trim();
          if (managementItem) {
            return managementItem;
          }
        });

        r.report.taskList.forEach(t => {
          if (t.progress === 100) {
            t.state = '完成';
          }
        });
        const unDoneArr = [];
        r.report.nextTasks.forEach(t => {
          if (t.type === 'postpone') {
            if (t.progress === 100) {
              t.state = '完成';
            } else {
              t.state = `${100 - t.progress}% 延至下一月`;
            }
            unDoneArr.push(t);
          }
        });
        r.taskList = r.report.taskList.concat(unDoneArr);
      });

      // 遍历上月获取当月计划
      prevMonth.forEach(item => {
        const g = groupMap.get(item.group.objectId);
        if (g) {
          g.plans = item.report.nextTasks || [];
        }
      });

      groupMap.clear();
      return currMonth;
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
        const weekTitle = `【${this.selectedWeekText}】汇总.html`;
        let weekData = this.getHtmlContent(this.$refs.weekSummary.$el);
        download(this.wrapAsHtml(weekData, weekTitle), weekTitle, false);
      }
      if (this.monthReports.length || this.monthWeekReports.length) {
        let monthData = this.getHtmlContent(this.$refs.monthSummary.$el);
        let monthTitle = `【${this.selectedMonthText}】汇总.html`;
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
      return `<!DOCTYPE html><html><head><style>*{box-sizing:border-box;}.ivu-icon-ios-checkmark:before {content: '100%';}.ivu-progress{display:inline-block;width:200px;font-size:12px;position:relative}.ivu-progress-vertical{height:100%;width:auto}.ivu-progress-outer{display:inline-block;width:100%;margin-right:0;padding-right:0}.ivu-progress-show-info .ivu-progress-outer{padding-right:55px;margin-right:-55px}.ivu-progress-vertical .ivu-progress-outer{height:100%;width:auto}.ivu-progress-inner{display:inline-block;width:100%;background-color:#f3f3f3;border-radius:100px;vertical-align:middle}.ivu-progress-vertical .ivu-progress-inner{height:100%;width:auto}.ivu-progress-vertical .ivu-progress-inner:after,.ivu-progress-vertical .ivu-progress-inner>*{display:inline-block;vertical-align:bottom}.ivu-progress-vertical .ivu-progress-inner:after{content:'';height:100%}.ivu-progress-bg{border-radius:100px;background-color:#2db7f5;transition:all .2s linear;position:relative}.ivu-progress-text{display:inline-block;margin-left:5px;text-align:left;font-size:1em;vertical-align:middle}.ivu-progress-active .ivu-progress-bg:before{content:'';opacity:0;position:absolute;top:0;left:0;right:0;bottom:0;background:#fff;border-radius:10px;animation:ivu-progress-active 2s ease-in-out infinite}.ivu-progress-wrong .ivu-progress-bg{background-color:#ed3f14}.ivu-progress-wrong .ivu-progress-text{color:#ed3f14}.ivu-progress-success .ivu-progress-bg{background-color:#19be6b}.ivu-progress-success .ivu-progress-text{color:#19be6b}@keyframes ivu-progress-active{0%{opacity:.3;width:0}100%{opacity:0;width:100%}}</style><title>${title}</title></head><body>${content}</body></html>`;
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
.week-range-tips {
  vertical-align: middle;
  margin: 10px;
}
</style>


