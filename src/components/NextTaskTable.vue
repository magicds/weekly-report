<template>
  <div>
    <table class="table table-bordered vertical-middle nexttasktable">
      <thead>
        <tr>
          <th>任务事项</th>
          <th>完成进度</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="index" v-for="(task, index) in taskList">
          <td>
            {{task.name}}
            <i-button @click="hanldeEdit(index, task)" v-if="task.editable">修改</i-button>
          </td>
          <td class="text-center progress-td">
            <i-progress :percent="task.progress" status="active"></i-progress>
          </td>
        </tr>
        <tr>
          <td class="text-center" colspan="2">
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
import Form from 'iview/src/components/form/';
import Input from 'iview/src/components/input/input';
import InputNumber from 'iview/src/components/input-number/';
import Progress from 'iview/src/components/progress';
import Slider from 'iview/src/components/slider';
import Modal from 'iview/src/components/modal/';
export default {
  name: 'nextTaskTable',
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
        name: '',
        progress: 0,
        editable: true
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
    hanldeEdit(index, task) {
      this.currIndex = index;
      this.$set(this, 'taskData', JSON.parse(JSON.stringify(task)));
      this.isAdd = false;
      this.showEditor = true;
    },
    cancel() {
      this.showEditor = false;
    }
  }
};
</script>


<style>
.nexttasktable .progress-td {
  min-width: 200px;
  max-width: 360px;
}
.nexttasktable td {
  vertical-align: middle;
}
</style>

