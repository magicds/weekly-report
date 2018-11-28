<template>
  <div class="summary" :isloading="isloading" :export-name="exportName">
    <div class="summary-loading" v-show="isloading">
      <div class="ivu-spin ivu-spin-large ivu-spin-fix">
        <div class="ivu-spin-main">
          <span class="ivu-spin-dot"></span>
          <div class="ivu-spin-text">加载中</div>
        </div>
      </div>
    </div>
    <table class="table-bordered table vertical-middle table-hover" id="person-summary" ref="table">
      <colgroup>
        <col
          v-for="(column, index) in columns"
          :key="column.key"
          :width="setCellWidth(column, index)"
        >
      </colgroup>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" class="text-center">
            <span class="column-name">{{column.title}}</span>
            <span class="ivu-table-sort" v-if="column.sortable">
              <i
                class="ivu-icon ivu-icon-arrow-up-b"
                @click="sort(column, 'asc')"
                :class="{on: column._sortType === 'asc'}"
              ></i>
              <i
                class="ivu-icon ivu-icon-arrow-down-b"
                @click="sort(column, 'desc')"
                :class="{on: column._sortType === 'desc'}"
              ></i>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in cloneData" :key="person.userId" v-if="person.show">
          <td class="text-center">
            {{person.username}}
            <span class="person-info" v-if="person.extInfo">({{person.extInfo}})</span>
          </td>
          <td :title="showDetail ? '' :'汇总情况下不展示周报数据详情，请导出查看'">
            <ul v-if="person.workList.length > 0" v-show="showDetail">
              <li v-for="(item, index) in person.workList" :key="index">
                {{item.content}}
                <span v-if="item.showTime">（{{item.time | toInteger}} 小时）</span>
              </li>
            </ul>
          </td>
          <td class="text-center">{{person.taskTime | toInteger}}</td>
          <td class="text-center">{{person.communicationTime | toInteger}}</td>
          <td class="text-center">{{person.studyTime | toInteger}}</td>
          <td
            :class="getSaturationStyle(person.saturation)"
            class="text-center"
          >{{person.saturation | getProportion}}</td>
          <td :title="showDetail ? '' :'汇总情况下不展示周报数据详情，请导出查看'">
            <ul v-if="person.leaveList.length > 0" v-show="showDetail">
              <li v-for="(item, index) in person.leaveList" :key="index">
                {{item.content}}
                <span v-if="item.showTime">（{{item.time | toInteger}} 小时）</span>
              </li>
            </ul>
            <span v-else v-show="showDetail">无</span>
          </td>
          <td class="text-center" v-if="showDate">
            <span v-if="person.uncommitted" class="text-danger">未提交</span>
            <span v-else :title="getTimeTitle(person)">{{person.updatedAt | formatTime}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <i-button type="primary" @click="exportTable">导出</i-button>
    <i-button type="primary" @click="showFilterDialog">选择</i-button>
    <div ref="person-charts" style="width:100%;height:400px;margin-top:20px"></div>
    <div ref="group-charts" style="width:100%;height:300px;"></div>

    <Modal
      v-model="showDialog"
      title="选择要显示的人员"
      width="200"
      @on-ok="saveFilterData"
      @on-cancel="resetFilterData"
    >
      <Tree :data="treeData" show-checkbox ref="tree"></Tree>
    </Modal>
  </div>
</template>

<script>
import Button from "iview/src/components/button/button";
import Modal from "iview/src/components/modal/";
import Tree from "iview/src/components/tree/";
import api from "@/api/index.js";
import ExcellentExport from "@/assets/libs/excellentexport.js";
import moment from "moment/min/moment.min.js";
import renderCharts, { resize as chartResize } from "./rendercharts.js";
import mergeSort from "@/util/sort.js";
import exportData from "./exportData.js";

const WEEKNAMES = ["一", "二", "三", "四", "五", "六", "日"];

/**
 * 克隆数据 并添加默认的排序标识_index
 * 简单通过json转化实现
 * @param {Array} data    原数组
 * @return {Array}     克隆后数组
 */
function getCloneData(data) {
  let d = JSON.parse(JSON.stringify(data));
  if (d.length && !d[0]._index) {
    d.forEach((item, i) => {
      item._index = i;
    });
  }
  return d;
}

export default {
  name: "summary",
  components: {
    "i-button": Button,
    Modal,
    Tree
  },
  props: {
    data: Array,
    isloading: {
      type: Boolean,
      default: false
    },
    exportName: {
      type: String,
      default: "周报"
    },
    showDetail: {
      type: Boolean,
      default: true
    },
    showDate: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    renderCharts(
      this.cloneData,
      this.$refs["person-charts"],
      this.$refs["group-charts"]
    );
    window.addEventListener("resize", this.resizeCharts);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  },
  created() {},
  updated() {
    if (this.cloneData && this.cloneData.length) {
      renderCharts(
        this.cloneData,
        this.$refs["person-charts"],
        this.$refs["group-charts"]
      );
    }
  },
  data() {
    let data = {
      timer: null,
      columns: [
        {
          title: "姓名",
          key: "username",
          sortable: true,
          width: "80px"
        },
        {
          title: "工作内容",
          key: "workList"
        },
        {
          title: "任务耗时",
          key: "taskTime",
          sortable: true,
          width: "90px"
        },
        {
          title: "沟通耗时",
          key: "communicationTime",
          sortable: true,
          width: "90px"
        },
        {
          title: "学习耗时",
          key: "studyTime",
          sortable: true,
          width: "90px"
        },
        {
          title: "饱和度",
          key: "saturation",
          sortable: true,
          width: "80px"
        },
        {
          title: "备注",
          key: "leaveList"
        }
      ],
      cloneData: this.filterPerson(getCloneData(this.data)),
      showDialog: false,
      treeData: this.getTreeData(this.data)
    };
    if (this.showDate) {
      data.columns.push({
        title: "提交时间",
        key: "updatedAt",
        sortable: true,
        width: "90px"
      });
    }
    return data;
  },
  filters: {
    getProportion(v) {
      return (v * 100).toFixed(2) + "%";
    },
    formatTime(v) {
      let c = moment(v);
      return c.format("MM-DD HH:mm") + " 周" + WEEKNAMES[c.isoWeekday() - 1];
    },
    toInteger(v) {
      return parseInt(v.toFixed(0), 10);
    }
  },
  methods: {
    resizeCharts() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$nextTick(chartResize);
        // chartResize();
      }, 50);
    },
    setCellWidth(column, index) {
      let width = "";
      if (column.width) {
        width = column.width;
      }
      return width;
    },
    // 设置饱和度样式
    // 0.9~1.2                  绿色
    // 1.2~1.4 或 0.7~0.9       黄色
    // 1.4+ 0.7-                红色 加粗
    getSaturationStyle(v) {
      if (v >= 1.4 || v < 0.7) {
        return "text-danger text-bold";
      } else if (v >= 1.2) {
        return "text-warning";
      } else if (v >= 0.9) {
        return "text-success";
      } else {
        return "text-warning";
      }
    },
    exportTable() {
      let save_link = document.createElement("a");
      // 克隆并还原隐藏内容
      var el = this.$refs.table.cloneNode(true);
      [].slice.call(el.querySelectorAll("ul")).forEach(ul => {
        ul.style.display = "block";
      });
      ExcellentExport.csv(save_link, el);
      save_link.download = this.exportName + ".csv";

      save_link.click();
      exportData(this.$el, this.data, this.exportName);
    },
    showFilterDialog() {
      this.showDialog = true;
    },
    sort(column, type) {
      if (column._sortType != type) {
        column._sortType = type;
        this.cloneData = mergeSort(this.cloneData, column.key, type);
      } else {
        column._sortType = "normal";
        // 恢复默认排序
        this.cloneData = mergeSort(this.cloneData, "_index", type);
      }
      console.log(column, column._sortType);
    },
    getTimeTitle(person) {
      let c = moment(person.createdAt);
      let u = moment(person.updatedAt);
      let title =
        "提交时间" +
        c.format("MM-DD HH:mm") +
        " 周" +
        WEEKNAMES[c.isoWeekday() - 1];

      if (c.isSame(u)) {
        return title;
      } else {
        return (
          title +
          "\r\n最后更新时间" +
          u.format("MM-DD HH:mm") +
          " 周" +
          WEEKNAMES[u.isoWeekday() - 1]
        );
      }
    },
    saveFilterData() {
      let unchecked = {};

      this.$refs.tree.data.forEach(item => {
        if (item.children) {
          item.children.forEach(p => {
            if (!p.checked) {
              unchecked[p.uid] = true;
            }
          });
        }
      });

      localStorage.setItem(
        "_weekly-report-notshow_",
        JSON.stringify(unchecked)
      );
      this.filterPerson(this.cloneData);
    },
    resetFilterData() {
      this.$set(this, "treeData", this.getTreeData(this.data));
    },
    filterPerson(data) {
      if (!data) return data;
      let notShows = JSON.parse(
        localStorage.getItem("_weekly-report-notshow_") || "{}"
      );
      data.forEach(item => {
        item.show = notShows[item.userId] ? false : true;
      });
      return data;
    },
    getTreeData(data) {
      if (!data) return [];
      let groups = [];

      let unchecked = JSON.parse(
        localStorage.getItem("_weekly-report-notshow_") || "{}"
      );

      data.forEach(item => {
        let gid = item.groupIndex;

        if (!groups[gid]) {
          groups[gid] = {
            id: gid,
            name: item.groupName,
            title: item.groupName,
            expand: true,
            children: [
              {
                uid: item.userId,
                title: item.username,
                checked: unchecked[item.userId] ? false : true
              }
            ]
          };
        } else {
          groups[gid].children.push({
            uid: item.userId,
            title: item.username,
            checked: unchecked[item.userId] ? false : true
          });
        }
      });

      // 根据人员组织出来的小组可能存在空的，将空值移除
      // 如没有用户在编号为0的小组
      // 则原 groups 为 [empty, {}, ...]
      // 树控件将报错
      for (var i = 0; i < groups.length; i++) {
        if (!groups[i]) {
          groups.splice(i, 1);
          i--;
        }
      }

      return groups;
    }
  },
  watch: {
    // 数据变化时更新表格数据
    data(newVal) {
      this.$set(this, "cloneData", this.filterPerson(getCloneData(newVal)));
      this.$set(this, "treeData", this.getTreeData(newVal));
    }
  }
};
</script>

<style>
.summary {
  position: relative;
}
.summary .table {
  table-layout: fixed;
}
.person-info {
  display: block;
}
.summary ul {
  margin: 0;
  padding: 0;
}
.ivu-tree-arrow {
  margin-right: 5px;
}
.ivu-checkbox-wrapper {
  margin-right: 0;
  margin-bottom: 0;
}
.ivu-tree ul li {
  margin: 0;
}
.vertical-middle td,
.vertical-middle th {
  vertical-align: middle;
}
.summary-loading {
  position: absolute;
  width: 100%;
  height: 100%;
}
.summary-loading .ivu-spin-fix .ivu-spin-main {
  position: fixed;
}
.summary-loading .ivu-spin-text {
  display: block;
}

/* .ivu-table-sort {
    visibility: hidden;
}
.vertical-middle th:hover .ivu-table-sort {
    visibility: visible;
} */
</style>


