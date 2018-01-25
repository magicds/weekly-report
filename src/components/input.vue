<template>
  <div class="person-input">
    <div class="alert alert-danger">
      <p>请大家每周五下班前按要求填写周报，若每月有3次未按要求填写周报，考虑月浮动奖罚，以做规范手段。</p>
      <p>周报的目的：</p>
      <ol class="weekly-aims">
        <li>
          <p>对自己本周工作进行一个如实总结。</p>
        </li>
        <li>
          <p>方便部门管理者、各小组负责人了解团队的整体运行情况。</p>
        </li>
      </ol>
      <p>请大家跳出自我的角度，多从管理者的角度、团队的角度考虑问题，就能理解其中的必要性。</p>
    </div>
    <i-form ref="form" :model="data" :rules="relues"  label-position="top">
      <fieldset>
        <legend>基本信息</legend>
        <div>{{user.groupName}} - {{user.username}} </div>
      </fieldset>
      <fieldset>
        <legend>工作内容</legend>

        <!-- <RadioGroup v-model="type">
          <i-radio v-for="item in types" :label="item.key" :key="item.key">
            <span>{{item.text}}</span>
          </i-radio>
        </RadioGroup> -->

        <FormItem label="类型" style="margin-top:10px; margin-bottom:0px;">
          <RadioGroup v-model="type">
            <i-radio v-for="item in types" :label="item.key" :key="item.key">
              <span>{{item.text}}</span>
            </i-radio>
          </RadioGroup>
        </FormItem>

        <div class="type-info">
          <ul>
            <li v-for="item in types" :class="item.key == type ? 'light' : ''">{{item.text}}：{{item.info}}</li>
          </ul>
        </div>

        <!-- <div class="title">{{currType.text}}</div> -->
        <FormItem :label="currType.text" prop="content">
          <i-input type="textarea" :rows="4" placeholder="请输入内容，回车将被自动分割为多条" element-id="content-input" v-model="data.content"></i-input>
        </FormItem>

        <div class="content-info">
          {{currType.explain}}
        </div>

        <FormItem :label="timeLabel.title" prop="time">
          <InputNumber :max="100" :min="0.1" :step="1" v-model="data.time"></InputNumber>
        </FormItem>

        <i-button type="primary" @click="addItem">添加并重置</i-button>
      </fieldset>

      <fieldset>
        <legend>事项列表</legend>
        <i-table :columns="tableColumns" :data="workList"></i-table>
      </fieldset>

      <fieldset>
        <legend>汇总</legend>

        <table class="table table-bordered vertical-middle">
          <thead>
            <tr>
              <th>姓名</th>
              <th>工作内容</th>
              <th>任务耗时</th>
              <th>学习耗时</th>
              <th>沟通耗时</th>
              <th>其他</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{user.username}}</td>
              <td>
                <ul>
                  <li v-for="item in workList">
                    {{item.content}} <span v-if="item.showTime">（{{item.time}}小时）</span>
                    </li>
                </ul>
              </td>
              <td>{{taskTime | getInt}}</td>
              <td>{{studyTime | getInt}}</td>
              <td>{{communicationTime | getInt}}</td>
              <td>
                <ul v-if="leaveList.length">
                  <li v-for="item in leaveList">
                    {{item.content}} <span v-if="item.showTime">（{{item.time}}小时）</span>
                  </li>
                </ul>
                <span v-else>无</span>
              </td>
            </tr>
          </tbody>
        </table>

        <i-button type="primary" @click="addToCloud" :disabled="reportList.length < 1" :loading="isSaving">提交到云端</i-button>
      </fieldset>
    </i-form>
  </div>
</template>

<script>
import config from '@/config/input.config.js';
import api from '@/api/index.js';
import Form from 'iview/src/components/form/';
import Input from 'iview/src/components/input/input';
import Button from 'iview/src/components/button/button';
import RadioGroup from 'iview/src/components/radio/radio-group';
import Radio from 'iview/src/components/radio/radio';
import InputNumber from 'iview/src/components/input-number/';
import Table from 'iview/src/components/table/table';
import Message from 'iview/src/components/Message/';
import Modal from 'iview/src/components/Modal/index.js';

// 从输入的内容中分隔出多条
function getItems(content) {
  let items = content.split(/\n|\r|\r\n/);
  for (var i = items.length - 1; i > 0; --i) {
    if (items[i].trim() === '') {
      items.splice(i, 1);
    }
  }
  return items;
}

// 自动生成一个id
let listIndex = 1;
function getIndex() {
  return 'list-' + listIndex++;
}

export default {
  name: 'input',
  components: {
    'i-form': Form,
    FormItem: Form.Item,
    'i-input': Input,
    'i-button': Button,
    RadioGroup,
    'i-radio': Radio,
    InputNumber,
    'i-table': Table
  },
  data() {
    return {
      type: config.defaultType,
      types: config.types,
      timeLabel: config.time,
      user: api.getCurrUser().attributes,
      data: {
        content: '',
        time: 0
      },
      taskList: [],
      studyList: [],
      communicationList: [],
      leaveList: [],
      relues: {
        content: [
          {
            required: true,
            message: '请输入任务描述',
            trigger: 'blur'
          }
        ],
        time: [
          {
            required: true,
            type: 'number',
            message: '必须输入花费时间',
            trigger: 'blur',
            min: 0.1
          }
        ]
      },
      tableColumns: [
        {
          title: '工作内容',
          key: 'content'
        },
        {
          title: '类型',
          key: 'typeText'
        },
        {
          title: '时间',
          key: 'time',
          render: (h, params) => {
            if (params.row.showTime) {
              return h('span', params.row.time);
            } else {
              return h('span', '--');
            }
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  props: {
                    type: 'normal',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editItem(params.row);
                    }
                  }
                },
                '编辑'
              ),
              h(
                'a',
                {
                  props: {
                    type: 'danger',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteItem(params.row);
                    }
                  }
                },
                '删除'
              )
            ]);
          }
        }
      ],
      isSaving: false
    };
  },
  filters: {
    getInt(v) {
      return v.toFixed(0);
    }
  },
  computed: {
    currType() {
      return this.types.filter(item => item.key === this.type)[0];
    },
    taskTime() {
      let time = 0;
      this.taskList.forEach(task => {
        time += task.time;
      });
      return time;
    },
    studyTime() {
      let time = 0;
      this.studyList.forEach(study => {
        time += study.time;
      });
      return time;
    },
    communicationTime() {
      let time = 0;
      this.communicationList.forEach(communication => {
        time += communication.time;
      });
      return time;
    },
    leaveTime() {
      let time = 0;
      this.leaveList.forEach(leave => {
        time += leave.time;
      });
      return time;
    },
    workList() {
      return this.taskList.concat(this.studyList, this.communicationList);
    },
    reportList() {
      return this.workList.concat(this.leaveList);
    }
  },
  watch: {
    currType() {
      this.relues.content[0].message = '请输入' + this.currType.title;
      this.$refs.form.validate();
    }
  },
  mounted() {
    Message.config({
      top: window.innerHeight * 0.4 || 400
    });
  },
  methods: {
    addItem() {
      this.$refs.form.validate(isValidated => {
        // 验证通过才处理
        if (isValidated) {
          let items = getItems(this.data.content);
          let length = items.length;
          let showTime = length > 1 ? false : true;

          items.forEach((item, i) => {
            this[this.currType.key + 'List'].push({
              id: getIndex(),
              type: this.currType.key,
              typeText: this.currType.text,
              content: item,
              showTime,
              time: parseFloat(this.data.time / length)
            });
          });

          this.data.content = '';
          this.data.time = 0;
        }
      });
    },
    deleteItem(row) {
      this[row.type + 'List'].splice(this.getItemIndex(row), 1);
    },
    editItem(row) {
      // // 编辑前先检查当前是否有内容 有则提示
      // Modal.confirm({
      //   title: '提醒',
      //   content: '当前已经有输入内容，是否丢弃当前的输入内容？',
      //   onOk: () => {

      //   }
      // })

      if (this.data.content.trim() || this.data.time) {
        Message.warning('请先处理当前正在输入的内容');
        return;
      }

      let currData = this[row.type + 'List'].splice(
        this.getItemIndex(row),
        1
      )[0];

      console.log(currData);
      this.type = currData.type;
      this.data.content = currData.content;
      this.data.time = currData.time;
    },
    addToCloud() {
      this.isSaving = true;

      api.checkIsSubmit().then(result => {
        // 存在结果则表示本周已经提交
        if (result.length) {
          let data = result[0];
          let content = JSON.stringify(
            JSON.parse(data.attributes.report),
            0,
            2
          );
          // let content = data.reportList
          let created = data.createdAt;
          let updated = data.updatedAt;
          console.log(data);
          Modal.confirm({
            title: '本周已经提交过了',
            content: `
            <p>您已经在${created}提交过本周的周报了，最后修改时间为${created}</p>
            <p>点击确定进行覆盖</p>
            <p>详细内容如下：</p>
            <pre>${content}</pre>
            `,
            onOk: () => {
              // data.set(
              //   'report',
              //   JSON.stringify({
              //     reportList: this.workList,
              //     studyTime: this.studyTime,
              //     taskTime: this.taskTime,
              //     communicationTime: this.communicationTime,
              //     leaveTime: this.leaveTime
              //   })
              // );
              // data.save()

              api
                .updateReport(data.id, {
                  workList: this.workList,
                  leaveList: this.leaveList,
                  studyTime: this.studyTime,
                  taskTime: this.taskTime,
                  communicationTime: this.communicationTime,
                  leaveTime: this.leaveTime,
                  saturation: (this.taskTime + this.communicationTime) / config.fullTime
                })
                .then(savedData => {
                  console.log(savedData);
                  this.isSaving = false;
                  this.showSuccessTips();
                });
            },
            onCancel: () => {}
          });
        } else {
          api
            .addReprot({
              workList: this.workList,
              leaveList: this.leaveList,
              studyTime: this.studyTime,
              taskTime: this.taskTime,
              communicationTime: this.communicationTime,
              leaveTime: this.leaveTime,
              saturation: (this.taskTime + this.communicationTime) / 40
            })
            .then(savedData => {
              console.log(savedData);
              this.isSaving = false;
              this.showSuccessTips();
            });
        }
      });
    },
    showSuccessTips() {
      Message.success('提交成功');
    },

    getItemIndex(item) {
      let index = -1;
      let list = this[item.type + 'List'];

      for (let i = 0, l = list.length; i < l; ++i) {
        if (list[i].id === item.id) {
          return (index = i);
        }
      }
    }
  }
};
</script>

<style scoped>
.header-wraings {
  text-align: left;
}
.ivu-input-number {
  width: 100%;
}
.table td,
.table th {
  vertical-align: middle;
}
.weekly-aims {
  list-style: decimal;
}
fieldset {
  margin-top: 20px;
}
legend {
  margin-bottom: 10px;
}

.type-info {
  background: #f8f8f9;
  border-radius: 4px;
  padding: 10px 20px;
  line-height: 26px;
  color: #464c5b;
  margin-bottom: 24px;
}
.type-info .light {
  color: #000;
  font-weight: bold;
}
.content-info {
  margin-bottom: 24px;
}
.ivu-form .ivu-form-item-label {
  font-size: 14px;
}
</style>


