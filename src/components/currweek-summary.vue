<template>
  <div class="currweeksummary">
    <my-summary :data="data" :full-time="fullTime"></my-summary>

    <div class="summary-fixed">
      <affix :offset-bottom="70">
        <span class="side-affix">查看汇总</span>
      </affix>
      <affix :offset-bottom="20">
        <span class="side-affix">查看表格</span>
      </affix>
    </div>
  </div>
</template>

<script>
import mySummary from './summary/summary.vue';
import Affix from 'iview/src/components/affix/affix';
import api from '@/api/index.js';
import Promise from 'bluebird'

// 获取数据
function getData(fullTime) {
  return Promise.all([
    api.getAllUser(),
    api.getCurrWeekData()
  ]).then(results => {
    console.log(results);

    window.results = results;

    let reports = dealReports(results[1], results[0], fullTime);
    window.reports = reports;

    return reports;
  });
}

// uses转化为map形式
function toMap(users) {
  let user = {};
  users.forEach(item => {
    user[item.id] = item.attributes;
  });
  return user;
}

// 处理为显示需要的数据
function dealReports(data, users, fullTime) {
  let reports = [],
    userMap = toMap(users),
    // 已经提交人人员集合
    submitedUsers = {};

  data.forEach(item => {
    let attrs = item.attributes,
      reportData = JSON.parse(attrs.report);

    submitedUsers[attrs.userId] = true;
    reports.push(
      Object.assign(
        {
          userId: attrs.userId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          saturation:
            (reportData.taskTime + reportData.communicationTime) / fullTime
        },
        userMap[attrs.userId],
        reportData
      )
    );
  });

  // 补上未提交人员的
  for (let i = 0, l = users.length; i < l; ++i) {
    if (!submitedUsers[users[i].id]) {
      reports.push(
        Object.assign(
          {
            // 标识此用户未提交 并补充默认数据
            uncommitted: true,
            userId: users[i].id,
            workList: [],
            leaveList: [],
            studyTime: 0,
            taskTime: 0,
            communicationTime: 0,
            leaveTime: 0,
            saturation: 0
          },
          users[i].attributes
        )
      );
    }
  }

  return reports;
}

export default {
  name: 'currweeksummary',
  components: {
    mySummary,
    Affix
  },
  data() {
    return {
      data: JSON.parse(
        '[{"userId":"5a0126e82f301e0069e964d8","createdAt":"2017-11-07T03:42:11.284Z","updatedAt":"2017-11-07T05:55:28.212Z","groupName":"Front End Support","username":"支撑人员1","emailVerified":false,"groupIndex":0,"mobilePhoneVerified":false,"workList":[{"id":"list-3","type":"task","typeText":"实际任务","content":"支撑工作1","showTime":false,"time":6.333333333333333},{"id":"list-4","type":"task","typeText":"实际任务","content":"支撑工作2","showTime":false,"time":6.333333333333333},{"id":"list-5","type":"task","typeText":"实际任务","content":"支撑工作3","showTime":false,"time":6.333333333333333},{"id":"list-6","type":"task","typeText":"实际任务","content":"维护工作1","showTime":false,"time":11.5},{"id":"list-7","type":"task","typeText":"实际任务","content":"维护工作2","showTime":false,"time":11.5},{"id":"list-8","type":"communication","typeText":"沟通管理","content":"问题讨论","showTime":true,"time":4}],"leaveList":[],"studyTime":0,"taskTime":42,"communicationTime":4,"leaveTime":0,"saturation":1.15},{"userId":"5a01277bfe88c20068352838","createdAt":"2017-11-07T06:25:48.710Z","updatedAt":"2017-11-07T06:25:48.710Z","groupName":"Front End Support","username":"支撑人员2","emailVerified":false,"groupIndex":0,"mobilePhoneVerified":false,"workList":[{"id":"list-1","type":"task","typeText":"实际任务","content":"是点击开发和接口申达股份接受多个 ","showTime":false,"time":6.666666666666667},{"id":"list-2","type":"task","typeText":"实际任务","content":"是打开返回即可申达股份","showTime":false,"time":6.666666666666667},{"id":"list-3","type":"task","typeText":"实际任务","content":"收到回复口接受多个附件库","showTime":false,"time":6.666666666666667},{"id":"list-4","type":"task","typeText":"实际任务","content":"收到回复给客户的顾客顾客的说风凉话个接口的覆盖","showTime":false,"time":6.666666666666667},{"id":"list-5","type":"task","typeText":"实际任务","content":"的返回个卡顿感客户给","showTime":false,"time":6.666666666666667},{"id":"list-6","type":"task","typeText":"实际任务","content":"后端反馈结构和","showTime":false,"time":6.666666666666667}],"leaveList":[],"studyTime":0,"taskTime":40,"communicationTime":0,"leaveTime":0,"saturation":1},{"uncommitted":true,"userId":"5a01134b1579a30045122e12","workList":[],"leaveList":[],"studyTime":0,"taskTime":0,"communicationTime":0,"leaveTime":0,"email":"516321242@qq.com","username":"管理员","emailVerified":false,"mobilePhoneVerified":false,"saturation":0}]'
      ),
      fullTime: 40
    };
  },
  created() {
    // getData(this.fullTime).then(data => {
    //   console.log(data);
    // })
    console.log('created');
  }
};
</script>

<style>
/* .ivu-affix {
  left: auto !important;
  width:
  right: 20px;
} */
.summary-fixed {
  width: 40px;
  float: right;
}
.side-affix {
  display: inline-block;
}
</style>

