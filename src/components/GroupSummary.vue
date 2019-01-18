<template>
  <div class="group-report">
    <div :key="report.objectId" class="group-report-item" v-for="report in cloneData">
      <h3>{{report.group.name}}</h3>
      <div class="summary-area">
        <fieldset>
          <legend>{{timeScope}}管理情况</legend>
          <div>
            <ul>
              <li :key="index" v-for="(item,index)  in report.managementArr">{{item}}</li>
            </ul>
          </div>
        </fieldset>
        <fieldset>
          <legend>{{timeScope}}工作情况</legend>
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
  </div>
</template>

<script>
import Progress from 'iview/src/components/progress';
export default {
  components: {
    'i-progress': Progress
  },
  props: {
    timeScope: {
      type: String,
      default: '本周'
    },
    reports: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      cloneData: this.dealData(this.reports)
    };
  },
  watch: {
    reports() {
      this.$set(this, 'cloneData', this.dealData(this.reports));
    }
  },
  methods: {
    dealData(data) {
      const copyData = JSON.parse(JSON.stringify(data));
      return data.map(d => {
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
            t.state = `${100 - t.progress}% 延至下${this.timeScope.substr(1)}`;
          }
          return t;
        });
        d.taskSummary = r.taskList.concat(nextTasks);
        return d;
      });
    }
  }
};
</script>

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
