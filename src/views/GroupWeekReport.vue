<template>
  <div class="group-week-report">
    <div class v-if="personDataLoaded">
      <legend>小组信息</legend>
      <p>
        <span>【小组】{{group.name}} - 【组长】 {{group.leader.username}}</span>
        <span class="group-report-select">
          <i-select @on-change="hanleWeekChange" v-model="selectedWeek">
            <i-option :key="item.id" :value="item.id" v-for="item in weekList">{{ item.text }}</i-option>
          </i-select>
        </span>
        <span class="text-muted daterange-tips">{{selectedWeek}}</span>
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
        <legend>本周工作完成情况</legend>
        <TaskTable :taskList="data.taskList" @done="handleTaskDone" @edit="handleTaskEdit"></TaskTable>
      </fieldset>

      <fieldset>
        <legend>下周任务安排</legend>
        <NextTaskTable :taskList="data.nextTasks" @addTask="handleAddNextTask" @editTask="handleEditNextTask"></NextTaskTable>
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
import dateUtil from '@/util/date';
import api from '@/api/';
import throwError from '@/api/error.js';
import AV from 'leancloud-storage';

export default {
  name: 'GroupReport',
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
    const currWeekText = dateUtil.getWeekText(d);
    const date = d.getDate() - 7;
    d.setDate(date);
    const prevWeekText = dateUtil.getWeekText(d);
    return {
      personDataLoaded: false,
      group: {},
      selectedWeek: currWeekText,
      selectedWeekObjectId: '',
      weekList: [
        {
          id: currWeekText,
          text: '本周'
        },
        {
          id: prevWeekText,
          text: '上周'
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
    prevWeekText() {
      const arr = this.selectedWeek.split('~');
      const startArr = arr[0].split('-');
      const endArr = arr[1].split('-');
      const s = new Date(parseInt(startArr[0], 10), parseInt(startArr[1], 10) - 1, parseInt(startArr[2], 10));
      const e = new Date(parseInt(endArr[0], 10), parseInt(endArr[1], 10) - 1, parseInt(endArr[2], 10));
      s.setDate(s.getDate() - 7);
      e.setDate(e.getDate() - 7);
      return `${s.getFullYear()}-${(s.getMonth() + 1 + '').padStart(2, 0)}-${(s.getDate() + '').padStart(2, 0)}~${e.getFullYear()}-${(e.getMonth() + 1 + '').padStart(2, 0)}-${(e.getDate() + '').padStart(2, 0)}`;
    }
  },
  mounted() {
    this.getPerson().then(() => {
      this.getData();
    });
  },
  methods: {
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
            this.selectedWeekObjectId = r[0].id;
            const data = JSON.parse(JSON.stringify(r[0]));
            this.$set(this, 'data', data.report);
          } else {
            // 不存在 则表示还未填 获取上周填写的作为本周计划
            this.selectedWeekObjectId = '';
            return this._getData(this.prevWeekText).then(r => {
              if (r.length) {
                const data = JSON.parse(JSON.stringify(r[0]));
                data.report.nextTasks.map(t => {
                  if (t.progress != 100) {
                    this.data.taskList.push(t);
                  }
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
      if (!title) title = this.selectedWeek;
      const query = new AV.Query('GroupWeekLog');
      const groupObj = AV.Object.createWithoutData('Group', this.group.objectId);
      query.equalTo('title', title);
      query.equalTo('group', groupObj);
      return query.find();
    },
    hanleWeekChange() {
      this.$set(this, 'data', {
        management: '',
        taskList: [],
        nextTasks: []
      });
      this.getData(this.selectedWeek);
    },
    handleTaskDone(task) {
      task.progress = 100;
    },
    handleTaskEdit(index, task) {
      // console.log(task);
      this.data.taskList.splice(index, 1);
      this.data.nextTasks.push(task);
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
    dealSaveData(data) {
      // 未完成的自动归档到下周
      for (let i = 0; i < data.taskList.length; i++) {
        const t = data.taskList[i];
        if (t.progress != 100) {
          t.type = 'auto';
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
      const groupWeekLog = this.selectedWeekObjectId ? AV.Object.createWithoutData('GroupWeekLog', this.selectedWeekObjectId) : new AV.Object('GroupWeekLog');
      const groupObj = AV.Object.createWithoutData('Group', this.group.objectId);
      groupWeekLog.set('report', data);
      groupWeekLog.set('group', groupObj);
      groupWeekLog.set('title', this.selectedWeek);
      groupWeekLog
        .save()
        .then(r => {
          console.log(r);
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

