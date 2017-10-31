<template>
  <div class="person-input">
    <div class="header-wraings">
      <p>请大家每周五下班前按要求填写周报，若每月有3次未按要求填写周报，考虑月浮动奖罚，以做规范手段。</p>
      <p>周报的目的：</p>
      <ol>
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
      </fieldset>
      <fieldset>
        <legend>工作内容</legend>

        <RadioGroup v-model="type">
          <i-radio v-for="item in types" :label="item.key" :key="item.key">
            <span>{{item.text}}</span>
          </i-radio>
        </RadioGroup>
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

      </fieldset>

      <fieldset>
        <legend></legend>
      </fieldset>
    </i-form>
  </div>
</template>

<script>
import config from '@/config/input.config.js'
import Form from 'iview/src/components/form/'
import Input from 'iview/src/components/input/input'
import Button from 'iview/src/components/button/button'
import RadioGroup from 'iview/src/components/radio/radio-group'
import Radio from 'iview/src/components/radio/radio'
import InputNumber from 'iview/src/components/input-number/'

console.log(Form)

export default {
  name: 'input',
  components: {
    'i-form': Form,
    FormItem: Form.Item,
    'i-input': Input,
    'i-button': Button,
    RadioGroup,
    'i-radio': Radio,
    InputNumber
  },
  data() {
    return {
      type: config.defaultType,
      types: config.types,
      timeLabel: config.time,
      data: {
        content: '',
        time: 0
      },
      relues: {
        content: [
          {
            required: true,
            message: '请输入任务描述',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    currType() {
      return this.types.filter(item => item.key === this.type)[0]
    }
  },
  watch: {
    currType() {
      this.relues.content[0].message = '请输入' + this.currType.title
      this.$refs.form.validate()
    }
  },
  methods: {
    ok() {
      this.$refs.form.validate(isValidated => {
        if (isValidated) {
        }
      })
    }
  }
}
</script>

<style>
.header-wraings {
  text-align: left;
}
</style>


