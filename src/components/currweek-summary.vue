<template>
  <div class="currweeksummary">
    <legend class="curr-summary-title">本周汇总<i  class="curr-summary-refresh icon icon-refresh" @click="refresh()" /></legend>
    <my-summary :data="data" :isloading="isloading"></my-summary>

    <!-- <div class="summary-fixed">
      <affix :offset-bottom="70">
        <span class="side-affix">查看汇总</span>
      </affix>
      <affix :offset-bottom="20">
        <span class="side-affix">查看表格</span>
      </affix>
    </div> -->
  </div>
</template>

<script>
import mySummary from './summary/summary.vue';
import Affix from 'iview/src/components/affix/affix';
import api from '@/api/index.js';
import Promise from 'bluebird';

// 获取数据
function getData() {
  return Promise.all([
    api.getAllUser(),
    api.getCurrWeekData()
  ]).then(results => {
    console.log(results);

    window.results = results;

    let reports = dealReports(results[1], results[0]);
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
function dealReports(data, users) {
  let reports = [],
    userMap = toMap(users),
    // 已经提交人人员集合
    submitedUsers = {};

  data.forEach(item => {
    let attrs = item.attributes,
      reportData = JSON.parse(attrs.report);

    if (!userMap[attrs.userId].noReport) {
      submitedUsers[attrs.userId] = true;
      reports.push(
        Object.assign(
          {
            userId: attrs.userId,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          },
          userMap[attrs.userId],
          reportData
        )
      );
    }
  });

  // 补上未提交人员的
  for (let i = 0, l = users.length; i < l; ++i) {
    // 需要填写日志 但是没有填写的
    if (!users[i].attributes.noReport && !submitedUsers[users[i].id]) {
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
      data: [],
      isloading:true
    };
  },
  created() {
    this.isloading = true;
    getData().then(data => {
      this.isloading = false;
      console.log(data);
      this.$set(this, 'data', data);
    });
    console.log('created');
  },
  methods: {
    refresh() {
      this.isloading = true;
      getData().then(data => {
        this.isloading = false;
        this.$set(this, 'data', data);
      });
    }
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
.curr-summary-title {
  font-size: 18px;
  line-height: 35px;
  margin-bottom: 10px;
}
.curr-summary-refresh {
  margin-left: 10px;
  cursor: pointer;
}
</style>

