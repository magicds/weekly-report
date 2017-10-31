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
    <i-form :model="data"  label-position="top">
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
        <FormItem :lable="currType.text" props="data.content">
          <i-input v-model="data.content"></i-input>
        </FormItem>

        <div class="content-info">
          {{currType.explain}}
        </div>

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

export default {
  name: 'input',
  components: {
    'i-form': Form,
    FormItem: Form.Item,
    'i-input': Input,
    'i-button': Button,
    RadioGroup,
    'i-radio': Radio
  },
  data() {
    return {
      type: config.defaultType,
      types: config.types,
      data: {
        content: ''
      }
    }
  },
  computed: {
    currType() {
      return this.types.filter(item => item.key === this.type)[0]
    }
  }
}
</script>

<style>
.header-wraings {
  text-align: left;
}
</style>


