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
    <form >
      <fieldset>
        <legend>基本信息</legend>
      </fieldset>
       <fieldset>
         <legend>工作内容</legend>

       </fieldset>
    </form>
  </div>
</template>

<script>
import config from '@/config/input.config.js'

export default {
  name: 'input',
  data() {
    return {
      type: config.defaultType,
      types: config.types
    }
  }
}
</script>

<style>
.header-wraings {
  text-align: left
}
</style>


