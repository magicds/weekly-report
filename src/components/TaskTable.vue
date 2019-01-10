<template>
  <div>
    <table class="table table-bordered vertical-middle tasktable">
      <thead>
        <tr>
          <th>任务事项</th>
          <th>完成进度</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="index" v-for="(task, index) in taskList">
          <td>
            {{task.name}}
            <i-button @click="hanldeEdit(index, task)" v-if="task.type == 'new'">修改</i-button>
            <i-button @click="hanldeDelete(index, task)" v-if="task.type == 'new'">删除</i-button>
          </td>
          <td class="text-center progress-td">
            <Slider show-input v-model="task.progress"></Slider>
          </td>
          <td class="text-center" width="190px">
            <i-button :disabled="task.progress==100" @click="handleEdit(index, task)">修改进度延期</i-button>
            <i-button @click="handleDone(task)">完成</i-button>
          </td>
        </tr>
        <tr>
          <td class="text-center" colspan="3">
            <i-button @click="hanldeAdd">新增</i-button>
          </td>
        </tr>
      </tbody>
    </table>
    <Modal :footerHide="true" :maskClosable="false" :title="modalTitle" v-model="showEditor">
      <i-form v-model="taskData">
        <FormItem label="任务名称" prop="name">
          <i-input placeholder="请输入任务名称" v-model="taskData.name"></i-input>
        </FormItem>
        <FormItem label="任务进度" prop="progress">
          <div style="margin-top:40px;">
            <Slider show-input v-model="taskData.progress"></Slider>
          </div>
        </FormItem>
        <i-button :disabled="disabledSave" @click="handleItem(taskData)">保存</i-button>
      </i-form>
    </Modal>
  </div>
</template>

<script>
import Button from 'iview/src/components/button/button';
import Slider from 'iview/src/components/slider';
import Form from 'iview/src/components/form/';
import Input from 'iview/src/components/input/input';
import InputNumber from 'iview/src/components/input-number/';
import Progress from 'iview/src/components/progress';
import Modal from 'iview/src/components/modal/';
export default {
  name: 'taskTable',
  components: {
    'i-button': Button,
    'i-progress': Progress,
    'i-form': Form,
    FormItem: Form.Item,
    'i-input': Input,
    Slider,
    Modal
  },
  data() {
    return {
      currIndex: -1,
      isAdd: true,
      showEditor: false,
      taskData: { name: '', progress: 0 }
    };
  },
  props: {
    taskList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    disabledSave() {
      return !this.taskData.name;
    },
    modalTitle() {
      return this.isAdd ? '新增任务' : '修改任务';
    }
  },
  methods: {
    hanldeAdd() {
      this.isAdd = true;
      this.$set(this, 'taskData', {
        type: 'new',
        name: '',
        progress: 0
      });
      this.showEditor = true;
    },
    handleItem() {
      if (!this.isAdd) {
        this.$emit('editTask', this.currIndex, this.taskData);
        this.showEditor = false;
        return;
      }
      this.$emit('addTask', this.taskData);
      this.showEditor = false;
    },
    hanldeDelete(index, task) {
      this.$emit('deleteTask', index, task);
    },
    cancel() {
      this.showEditor = false;
    },
    handleDone(task) {
      this.$emit('done', task);
    },
    hanldeEdit(index, task) {
      this.currIndex = index;
      this.$set(this, 'taskData', JSON.parse(JSON.stringify(task)));
      this.isAdd = false;
      this.showEditor = true;
    },
    handleEdit(index, task) {
      this.$emit('postpone', index, task);
    }
  }
};
</script>
<style>
.tasktable .ivu-slider .ivu-input-number {
  width: 60px;
}
.tasktable .ivu-slider-input .ivu-slider-wrap {
  margin-right: 70px;
}
.tasktable .progress-td {
  min-width: 200px;
  max-width: 300px;
}
.tasktable td {
  vertical-align: middle;
}
</style>

