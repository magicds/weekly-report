<template>
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
        <td>{{task.name}}</td>
        <td class="text-center progress-td">
          <Slider show-input v-model="task.progress"></Slider>
        </td>
        <td class="text-center" width="190px">
          <i-button :disabled="task.progress==100" @click="handleEdit(index, task)">修改进度延期</i-button>
          <i-button @click="handleDone(task)">完成</i-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Button from 'iview/src/components/button/button';
import Slider from 'iview/src/components/slider';
export default {
  name: 'taskTable',
  components: {
    'i-button': Button,
    Slider
  },
  props: {
    taskList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {
    handleDone(task) {
      this.$emit('done', task);
    },
    handleEdit(index, task) {
      this.$emit('edit', index, task);
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

