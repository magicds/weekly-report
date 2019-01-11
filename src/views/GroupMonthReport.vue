<template>
  <div class="group-month-report">
    <div class v-if="personDataLoaded">
      <legend>小组信息</legend>
      <p>
        <span>【小组】{{group.name}} - 【组长】 {{group.leader.username}}</span>
        <span class="group-report-select">
          <i-select @on-change="hanleMonthChange" v-model="selectedMonth">
            <i-option :key="item.id" :value="item.id" v-for="item in monthList">{{ item.text }}</i-option>
          </i-select>
        </span>
        <span class="text-muted daterange-tips">{{selectedMonth}}</span>
      </p>
    </div>
    <i-form :model="data" :rules="rules" label-position="top" ref="form">
      <fieldset>
        <legend>管理情况</legend>
        <FormItem prop="management">
          <i-input :rows="4" placeholder="请输入本周管理情况" type="textarea" v-model="data.management"></i-input>
        </FormItem>
      </fieldset>

      <fieldset>
        <legend>本月工作完成情况</legend>
        <TaskTable :taskList="data.taskList" @done="handleTaskDone" @postpone="handleTaskPostpone" @addTask="handleAddTask" @editTask="handleEditTask" @deleteTask="handleDeleteTask"></TaskTable>
      </fieldset>

      <fieldset>
        <legend>下月任务安排</legend>
        <NextTaskTable :taskList="data.nextTasks" @addTask="handleAddNextTask" @editTask="handleEditNextTask" @deleteTask="handleDeleteNextTask"></NextTaskTable>
      </fieldset>
      <i-button :disabled="disabledSave" :loading="isSaving" @click="addToCloud" type="primary">提交</i-button>
    </i-form>
  </div>
</template>

<script>
import Form from 'iview/src/components/form/';
import Input from 'iview/src/components/input/input';
import Button from 'iview/src/components/button/button';
import InputNumber from 'iview/src/components/input-number/';
import { Select, Option } from 'iview/src/components/select';
import Message from 'iview/src/components/message';
import TaskTable from '../components/TaskTable';
import NextTaskTable from '../components/NextTaskTable';
import api from '@/api/';
import throwError from '@/api/error.js';
import AV from 'leancloud-storage';

export default {
  name: 'GroupMonthReport',
  components: {
    'i-form': Form,
    FormItem: Form.Item,
    'i-input': Input,
    'i-button': Button,
    'i-select': Select,
    'i-option': Option,
    InputNumber,
    TaskTable,
    NextTaskTable
  },
  data() {
    const d = new Date();
    d.setDate(1);
    const currMonthText = this.getMonthText(d);
    const m = d.getMonth() - 1;
    d.setMonth(m);
    const prevMonthText = this.getMonthText(d);
    return {
      personDataLoaded: false,
      group: {},
      selectedMonth: currMonthText,
      selectedMonthObjectId: '',
      monthList: [
        {
          id: currMonthText,
          text: '本月'
        },
        {
          id: prevMonthText,
          text: '上月'
        }
      ],
      rules: {
        management: [{ required: true, message: '请输入管理内容', trigger: 'blur' }]
      },
      isSaving: false,
      data: {
        management: '',
        taskList: [],
        nextTasks: []
      }
    };
  },
  computed: {
    disabledSave() {
      return !(this.data.management && (this.data.taskList.length || this.data.nextTasks.length));
    },
    prevMonthText() {
      const arr = this.selectedMonth.split('-');
      const s = new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, 1);
      s.setDate(s.getMonth() - 1);
      return `${s.getFullYear()}-${(s.getMonth() + 1 + '').padStart(2, 0)}`;
    }
  },
  mounted() {
    this.getPerson().then(() => {
      this.getData();
    });
  },
  methods: {
    getMonthText(date) {
      return `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, 0)}`;
    },
    getPerson() {
      return api.getCurrUserAsync().then(u => {
        const user = JSON.parse(JSON.stringify(u));
        this.$set(this, 'group', user.group);
        this.personDataLoaded = true;
      });
    },
    getData(title) {
      return this._getData(title)
        .then(r => {
          // 存在则是 保存过了 是修改
          if (r.length) {
            this.selectedMonthObjectId = r[0].id;
            const data = JSON.parse(JSON.stringify(r[0]));
            this.$set(this, 'data', data.report);
          } else {
            // 不存在 则表示还未填 获取上周填写的作为本周计划
            this.selectedMonthObjectId = '';
            return this._getData(this.prevMonthText).then(r => {
              if (r.length) {
                const data = JSON.parse(JSON.stringify(r[0]));
                data.report.nextTasks.map(t => {
                  if (t.type == 'new') {
                    t.type = 'plan';
                  }
                  this.data.taskList.push(t);
                });
              }
            });
          }
        })
        .catch(err => {
          throwError(err);
        });
    },
    _getData(title) {
      if (!title) title = this.selectedMonth;
      const query = new AV.Query('GroupMonthLog');
      const groupObj = AV.Object.createWithoutData('Group', this.group.objectId);
      query.equalTo('title', title);
      query.equalTo('group', groupObj);
      return query.find();
    },
    hanleMonthChange() {
      this.$set(this, 'data', {
        management: '',
        taskList: [],
        nextTasks: []
      });
      this.getData(this.selectedMonth);
    },
    handleTaskDone(task) {
      task.progress = 100;
    },
    handleTaskPostpone(index, task) {
      // console.log(task);
      this.data.taskList.splice(index, 1);
      task.type = 'postpone';
      this.data.nextTasks.push(task);
    },
    handleAddTask(task) {
      this.data.taskList.push(JSON.parse(JSON.stringify(task)));
    },
    handleEditTask(index, task) {
      const t = this.data.taskList[index];
      if (t) {
        t.name = task.name;
        t.progress = task.progress;
      }
    },
    handleDeleteTask(index) {
      this.data.taskList.splice(index, 1);
    },
    handleAddNextTask(task) {
      this.data.nextTasks.push(JSON.parse(JSON.stringify(task)));
    },
    handleEditNextTask(index, task) {
      const t = this.data.nextTasks[index];
      if (t) {
        t.name = task.name;
        t.progress = task.progress;
      }
    },
    handleDeleteNextTask(index) {
      this.data.nextTasks.splice(index, 1);
    },
    dealSaveData(data) {
      // 未完成的自动归档到下月
      for (let i = 0; i < data.taskList.length; i++) {
        const t = data.taskList[i];
        if (t.progress != 100) {
          t.type = 'postpone';
          data.taskList.splice(i--, 1);
          data.nextTasks.push(t);
        }
      }
    },
    addToCloud() {
      this.isSaving = true;
      const data = JSON.parse(
        JSON.stringify({
          management: this.data.management,
          taskList: this.data.taskList,
          nextTasks: this.data.nextTasks
        })
      );
      this.dealSaveData(data);
      const groupMonthLog = this.selectedMonthObjectId ? AV.Object.createWithoutData('GroupMonthLog', this.selectedMonthObjectId) : new AV.Object('GroupMonthLog');
      const groupObj = AV.Object.createWithoutData('Group', this.group.objectId);
      groupMonthLog.set('report', data);
      groupMonthLog.set('group', groupObj);
      groupMonthLog.set('title', this.selectedMonth);
      groupMonthLog
        .save()
        .then(r => {
          console.log(r);
          this.selectedMonthObjectId = r.id;
          this.isSaving = false;
          Message.success({
            content: '提交成功'
          });
        })
        .catch(err => {
          this.isSaving = false;
          throwError(err);
        });
    }
  }
};
</script>

<style scoped>
.group-report-select,
.daterange-tips {
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}
</style>

