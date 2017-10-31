// 填写界面的相关配置
export default {
  types: [
    {
      key: 'task',
      text: '实际任务',
      title: '任务描述',
      explain:
        '请填写任务名称，并简要说明任务的进展情况，如存在风险，请一并说明。如：招投标大数据平台页面开发，涉及大量图表，部分页面需求还在变更，确定的已完成80%，暂无风险。'
    },
    {
      key: 'communication',
      text: '沟通管理',
      title: '沟通内容',
      explain: '请填写沟通内容，如：评审某某的代码，形成评审纪要，并沟通明确整改。'
    },
    {
      key: 'study',
      text: '学习研究',
      title: '学习内容',
      explain: '请填写学习内容，如：学习handlebars模版引擎，并进行实践。'
    },
    {
      key: 'leave',
      text: '请假调休',
      title: '请假说明',
      explain: '请如实填写请假缘由，如：近期加班较多，目前手头任务可控，调休一天，自我调节。'
    }
  ],
  defaultTypes: 'task'
}
