<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>周报填写</title>
    <?php include '../_include/cssboot.inc.php' ?>
    <link rel="stylesheet" href="../../js/lib/ztree/css/zTreeStyle/zTreeStyle.css">
    <link rel="stylesheet" href="weeklyreport.css">
</head>

<body>
    <div class="container">
        <ul class="nav nav-tabs">
            <li class="active"><a href="###" data-target="#tab2Content1" data-toggle="tab">个人周报</a></li>
            <li><a href="###" data-target="#tab2Content5" data-toggle="tab">本月计划</a></li>
            <li><a href="###" data-target="#tab2Content3" data-toggle="tab">本周计划</a></li>
            <li><a href="###" data-target="#tab2Content4" data-toggle="tab" id="view-summary">查看汇总</a></li>
        </ul>
        <div class="tab-content">
            <!-- 个人填写 -->
            <div class="tab-pane fade active in" id="tab2Content1">
                <div>
                    <h2>个人周报填写</h2>
                    <!-- <div class="alert alert-warning">
                        <p>请各位在每周工作日最后一天（一般为周五）的下午5点前把本周的周报填写好，提交到云端。请注意不要更改别人的数据。</p>
                    </div> -->
                    <div class="alert alert-danger">
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
                    <form id="report">
                        <fieldset>
                            <legend>基本信息</legend>
                            <!-- <div class="form-group">
                                <label for="user">组员姓名</label>
                                <select class="form-control" id="user" v-model="user" @change="saveName">
                                    <option v-for="option in userOptions" v-bind:value="option" >
                                        {{option.name}}
                                    </option>
                                </select>
                                <div class="help-block alert">请选择自己的姓名。</div>
                            </div> -->
                            <table class="table table-borderless">
                                <thead>
                                    <tr>
                                        <th>所属小组</th>
                                        <th>姓名</th>
                                        <th>填写日期</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{{user.group}}</td>
                                        <td>{{user.name}}</td>
                                        <td>{{date}}</td>
                                        <td><button class="btn btn-link" type="button" data-position="100px" data-toggle="modal"
                                                data-target="#user-choose">调整</button></td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- 不在周五填写时 提醒 -->
                            <div class="help-block" v-show="!isFriday">
                                <i class="icon icon-info-sign"></i>请在周五下班前填写好周报，遇到节假日，在放假前一天下班前填写。
                            </div>
                            <!-- 人员选择dialog -->
                            <div class="modal fade" id="user-choose">
                                <div class="modal-dialog modal-sm">
                                    <div class="modal-content">
                                        <!-- <div class="modal-header">
                                             <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                                            <h4 class="modal-title">标题</h4> 
                                        </div> -->
                                        <div class="modal-body">
                                            <div class="form-group">
                                                <label for="group">所属小组</label>
                                                <select class="form-control" v-model="group">
                                                    <option v-for="option in groupOptions" v-bind:value="option" >
                                                        {{option.name}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label for="user">姓名</label>
                                                <select class="form-control" v-model="user">
                                                    <option v-for="option in group.member" v-bind:value="option" >
                                                        {{option.name}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <button type="button" class="btn btn-primary" data-dismiss="modal" @click="saveName">保存</button>
                                                <label class="checkbox-inline">
                                                    <input type="checkbox" v-model="rememberUser" > 记住以上选择，下次不再显示
                                                </label>
                                            </div>
                                        </div>
                                        <!-- <div class="modal-footer">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                                            <button type="button" class="btn btn-primary">保存</button>
                                        </div> -->
                                    </div>
                                </div>
                            </div>

                        </fieldset>
                        <fieldset>
                            <legend>工作内容</legend>
                            <div class="form-group">
                                <label for="type">类型</label>
                                <!-- <select class="form-control" id="type" v-model="type">
                                    <option v-for="option in typeOptions" :value="option.value">
                                        {{option.text}}
                                    </option>
                                </select> -->
                                <div>
                                    <label class="radio-inline" v-for="option in typeOptions">
                                        <input type="radio" name="worktype" v-model="type" :value="option.value"> {{option.text}}
                                    </label>
                                </div>
                                <div class="help-block alert">
                                    <ul class="work-type-description">
                                        <li>
                                            <p :class="type == 'task' ? 'light' : ''">实际任务：能够获取到外部预算的开发任务，任务跟进过程中的沟通工作也包括在内。</p>
                                        </li>
                                        <li>
                                            <p :class="type == 'communication' ? 'light' : ''">沟通管理：主要针对团队内部的沟通管理工作，包括：工作督导、人员安排、代码评审等。</p>
                                        </li>
                                        <li>
                                            <p :class="type == 'study' ? 'light' : ''">学习研究：在自身工作有余力的情况下，进行的自我学习和技术研究，也包括新人的联系与学习。</p>
                                        </li>
                                        <li>
                                            <p :class="type == 'leave' ? 'light' : ''">请假调休：确有急事请假 或者 正常调休。</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div :class="contentClass">
                                <label for="content" class="required">{{contentTitle}}</label>
                                <textarea id="content" class="form-control" v-model="content" rows="3"></textarea>
                                <div class="help-block alert" v-html="contentExplain"></div>
                            </div>
                            <div :class="timeClass">
                                <label for="time" class="required">所花时间</label>
                                <input id="time" type="number" v-model.number="time" class="form-control" min="0">
                                <div class="help-block alert">请填写该事项所花费的时间，如果周末有加班时间，可以预先填报。</div>
                            </div>
                            <button type="button" @click="addItem" class="btn btn-primary">添加并重置</button>
                        </fieldset>
                        <fieldset>
                            <legend>事项列表</legend>
                            <table class="table-bordered table table-condensed">
                                <thead>
                                    <tr>
                                        <th class="text-center">工作内容</th>
                                        <th class="text-center" width="100px">类型</th>
                                        <th class="text-center" width="80px">时间</th>
                                        <th class="text-center" width="60px">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in reportList">
                                        <td>{{item.content}}</td>
                                        <td class="text-center">{{item.type}}</td>
                                        <td class="text-center">
                                            <span v-if="item.showTime">{{item.time}}小时</span>
                                            <span v-else>--</span>
                                        </td>
                                        <td class="text-center"><a href="###" @click="deletItem(item.id,item.type)">删除</a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>
                        <fieldset>
                            <legend>汇总</legend>
                            <table v-if="reportList.length > 0" id="summary" class="table-bordered table vertical-middle">
                                <thead>
                                    <tr>
                                        <th class="text-center">姓名</th>
                                        <th class="text-center">工作内容</th>
                                        <th class="text-center">任务耗时</th>
                                        <th class="text-center">学习耗时</th>
                                        <th class="text-center">沟通耗时</th>
                                        <th class="text-center">其他</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="text-center" width="100px">{{user.name}}</td>
                                        <td>
                                            <ul>
                                                <li v-for="item in workList">
                                                    {{item.content}} <span v-if="item.showTime">（{{item.time}}小时）</span>
                                                </li>
                                            </ul>
                                        </td>
                                        <td class="text-center" width="80px">{{taskTime}}小时</td>
                                        <td class="text-center" width="80px">{{studyTime}}小时</td>
                                        <td class="text-center" width="80px">{{communicationTime}}小时</td>
                                        <td width="300px">
                                            <ul v-if="leaveList.length > 0">
                                                <li v-for="item in leaveList">
                                                    {{item.content}} <span v-if="item.showTime">（{{item.time}}小时）</span>
                                                </li>
                                            </ul>
                                            <span v-else>无</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="clearfix">
                                <button type="button" @click="saveToClond" class="btn btn-primary pull-left">提交到云端</button>
                                <!-- <button type="button" @click="openReportPage" class="btn btn-primary pull-right">查看汇总</button> -->
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
            <!-- 本月计划填写 -->
            <div class="tab-pane fade" id="tab2Content5">
                <h2>本月计划</h2>
                <div class="alert alert-warning">
                    <p>请各小组的负责人在月初及时填下本月计划，并提交，注意不要修改其他小组的数据。</p>
                </div>
                <form id="group-month-plan">
                    <fieldset>
                        <legend>组别信息</legend>
                        <div class="form-group">
                            <label for="user">组名</label>
                            <select class="form-control" id="group" v-model="group" @change="saveGroup">
                                <option v-for="option in groupOptions" v-bind:value="option" >
                                    {{option.name}}
                                </option>
                            </select>
                            <div class="help-block alert">请选择要填写的小组。</div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>相关内容</legend>
                        <div :class="contentClass">
                            <label for="content" class="required">本月计划描述</label>
                            <textarea id="content" class="form-control" v-model="content" rows="3"></textarea>
                            <div class="help-block alert">请填写本月计划描述。<br>输入换行符会自动分隔成新条目。</div>
                        </div>
                        <button type="button" @click="addItem" class="btn btn-primary">添加并重置</button>
                    </fieldset>
                    <fieldset>
                        <legend>事项列表</legend>
                        <table class="table-bordered table table-condensed">
                            <thead>
                                <tr>
                                    <th class="text-center">本月计划内容</th>
                                    <th class="text-center" width="150px">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in monthPlanList">
                                    <td>{{item.content}}</td>
                                    <td class="text-center"><a href="###" @click="deletItem(item.id)">删除</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                    <fieldset>
                        <legend>内容预览</legend>
                        <table class="table-bordered table vertical-middle">
                            <thead>
                                <tr>
                                    <th class="text-center">组名</th>
                                    <th class="text-center">本月计划内容</th>
                                </tr>
                            </thead>
                            <tbody v-if="monthPlanList.length > 0">
                                <tr>
                                    <td class="text-center" width="180px">{{group.name}}</td>
                                    <td>
                                        <ul v-if="monthPlanList.length > 0">
                                            <li v-for="item in monthPlanList">
                                                {{item.content}}
                                            </li>
                                        </ul>
                                        <span v-else>无</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="clearfix">
                            <button type="button" @click="saveToClond" class="btn btn-primary pull-left">提交到云端</button>
                        </div>
                    </fieldset>
                </form>
            </div>

            <!-- 周计划填写 -->
            <div class="tab-pane fade" id="tab2Content3">
                <h2>本周计划</h2>
                <div class="alert alert-warning">
                    <p>请各小组的负责人在每周周一下班前及时把本周计划填写好，提交到云端。请注意不要更改其他小组的数据。</p>
                </div>
                <form id="group-plan">
                    <fieldset>
                        <legend>组别信息</legend>
                        <div class="form-group">
                            <label for="user">组名</label>
                            <select class="form-control" id="group" v-model="group" @change="saveGroup">
                                <option v-for="option in groupOptions" v-bind:value="option" >
                                    {{option.name}}
                                </option>
                            </select>
                            <div class="help-block alert">请选择要填写的小组。</div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>相关内容</legend>
                        <div :class="contentClass">
                            <label for="content" class="required">本周计划工作内容</label>
                            <textarea id="content" class="form-control" v-model="content" rows="3"></textarea>
                            <div class="help-block alert">请填写本周计划的具体内容。<br>输入换行符会自动分隔成新条目。</div>
                        </div>
                        <button type="button" @click="addItem" class="btn btn-primary">添加并重置</button>
                    </fieldset>
                    <fieldset>
                        <legend>事项列表</legend>
                        <table class="table-bordered table table-condensed">
                            <thead>
                                <tr>
                                    <th class="text-center">本周计划内容</th>
                                    <th class="text-center" width="150px">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in planList">
                                    <td>{{item.content}}</td>
                                    <td class="text-center"><a href="###" @click="deletItem(item.id)">删除</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                    <fieldset>
                        <legend>内容预览</legend>
                        <table class="table-bordered table vertical-middle">
                            <thead>
                                <tr>
                                    <th class="text-center">组名</th>
                                    <th class="text-center">本周计划工作内容</th>
                                </tr>
                            </thead>
                            <tbody v-if="planList.length > 0">
                                <tr>
                                    <td class="text-center" width="180px">{{group.name}}</td>
                                    <td>
                                        <ul v-if="planList.length > 0">
                                            <li v-for="item in planList">
                                                {{item.content}}
                                            </li>
                                        </ul>
                                        <span v-else>无</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="clearfix">
                            <button type="button" @click="saveToClond" class="btn btn-primary pull-left">提交到云端</button>
                        </div>
                    </fieldset>
                </form>
            </div>
            <!-- 汇总 -->
            <div class="tab-pane fade" id="tab2Content4">
                <h2>周报汇总</h2>
                <div class="alert alert-info">
                    <p class="text-muted">如果提交日期文本为红色，表示此人(小组)还未提交本周周报。</p>
                </div>
                <div class="summary-menu" id="summary-menu">
                    <nav class="menu" data-toggle="menu">
                        <ul class="nav nav-primary">
                            <li>
                                <a data-toggle="tooltip" data-placement="right" title="查看个人周报汇总" href="#" class="icon icon-user" data-position="#person-report"></a>
                            </li>
                            <li>
                                <a data-toggle="tooltip" data-placement="right" title="查看小组周报汇总" href="#" class="icon icon-group" data-position="#month-plan-summary">
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <form id="summary-page">
                    <fieldset id="person-report">
                        <legend class="summary-title">个人周报汇总<i class="icon icon-refresh" data-id="person" title="点击刷新"></i></legend>
                        <table id="person-summary" class="table-bordered table vertical-middle table-hover">
                            <thead>
                                <tr @click="sort">
                                    <!-- <th class="text-center">组名</th> -->
                                    <th class="text-center ">姓名</th>
                                    <th class="text-center ">工作内容</th>
                                    <th class="text-center js-sort default" data-filed="taskTime">任务耗时<i class="icon icon-sort"></i></th>
                                    <th class="text-center js-sort default" data-filed="studyTime">学习耗时<i class="icon icon-sort"></i></th>
                                    <th class="text-center js-sort default" data-filed="communicationTime">沟通耗时<i class="icon icon-sort"></i></th>
                                    <th class="text-center js-sort default" data-filed="saturation">饱和度<i class="icon icon-sort"></i></th>
                                    <th class="text-center ">备注</th>
                                    <th class="text-center js-sort default" data-filed="updateAt">提交时间<i class="icon icon-sort"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in reportList">
                                    <!-- <td class="text-center" width="80px">{{item.groupName}}</td> -->
                                    <td class="text-center" width="90px">{{item.name}}</td>
                                    <td class="td-content" width="400px">
                                        <ul v-if="item.workList.length > 0">
                                            <li v-for="work in item.workList">{{work.content}}<span v-if="work.showTime">（{{work.time}}小时）</span><span v-else> </span></li>
                                        </ul>
                                        <span v-else> </span>
                                    </td>
                                    <td class="text-center" width="110px">{{item.taskTime}}</td>
                                    <td class="text-center" width="110px">{{item.studyTime}}</td>
                                    <td class="text-center" width="110px">{{item.communicationTime}}</td>
                                    <td class="text-center" :class="getSaturationStyle(item.saturation)" width="70px">{{item.saturation | getProportion}}</td>
                                    <td width="200px">
                                        <ul v-if="item.leaveList.length > 0">
                                            <li v-for="leave in item.leaveList">{{leave.content}} <span v-if="leave.showTime">（{{leave.time}}小时）</span>
                                                <span v-else> </span>
                                            </li>
                                        </ul>
                                        <span v-else>无</span>
                                    </td>
                                    <td width="120px" :class="['text-center', {'text-danger': item.date.noUpdate}]">{{item.date.content}}</td>
                                </tr>
                            </tbody>
                        </table>                        
                        <button v-if="isChrome" type="button" @click="exportPic" class="btn btn-primary" data-toggle="tooltip" data-placement="right"
                            title="个人周报汇总">导出为CSV</button>
                        <div class="alert alert-danger" v-else>导出文件功能暂时只支持chrome！请换用chrome！</div>
                        <!-- 对话框触发按钮 -->
                        <button type="button" class="btn btn-primary pull-right" data-toggle="modal" data-target="#showDialog">选择要显示的人员</button>
                        <!-- 对话框HTML -->
                        <div class="modal fade" id="showDialog">
                            <div class="modal-dialog  modal-sm">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                                        <h4 class="modal-title">选择要显示的人员</h4>
                                    </div>
                                    <ul class="modal-body">
                                        <ul class="ztree person-tree" id="person-tree" style="width:270px;"></ul>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" class="btn btn-primary" @click="saveAndUpdate">保存</button>
                                </div>
                            </div>
                        </div>
                        <!-- 成员饱和度表格 -->
                        <div id="person-saturation-chart"  style="width:100%;height:300px; margin-top:20px;"></div>
                        <div id="group-saturation-chart"  style="width:100%;height:200px;"></div>
                    </fieldset>

                    <fieldset id="month-plan-summary">
                        <legend class="summary-title">本月计划汇总 <i class="icon icon-refresh" data-id="monthPlan" title="点击刷新"></i></legend>
                        <table id="group-summary3" class="table-bordered table vertical-middle table-hover">
                            <thead>
                                <tr>
                                    <th class="text-center">组名</th>
                                    <th class="text-center">本月计划</th>
                                    <th class="text-center">提交时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in groupList">
                                    <td class="text-center" width="120px">{{item.name}}</td>
                                    <td>
                                        <ul v-if="item.monthPlanList.length > 0">
                                            <li v-for="monthPlan in item.monthPlanList">{{monthPlan.content}}</li>
                                        </ul>
                                        <span v-else>无</span>
                                    </td>
                                    <td width="150px" :class="{'text-danger':item.monthPlanDate.noUpdate}">{{item.monthPlanDate.content}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button v-if="isChrome" type="button" @click="exportPic" class="btn btn-primary" data-toggle="tooltip" data-placement="right"
                            title="小组本月计划汇总">导出为CSV</button>
                        <div class="alert alert-danger" v-else>导出文件功能暂时只支持chrome！请换用chrome！</div>
                    </fieldset>
                    <fieldset id="plan-summary">
                        <legend class="summary-title">本周计划汇总 <i class="icon icon-refresh" data-id="plan" title="点击刷新"></i></legend>
                        <table id="group-summary2" class="table-bordered table vertical-middle table-hover">
                            <thead>
                                <tr>
                                    <th class="text-center">组名</th>
                                    <th class="text-center">本周计划</th>
                                    <th class="text-center">提交时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in groupList">
                                    <td class="text-center" width="120px">{{item.name}}</td>
                                    <td>
                                        <ul v-if="item.planList.length > 0">
                                            <li v-for="plan in item.planList">{{plan.content}}</li>
                                        </ul>
                                        <span v-else>无</span>
                                    </td>
                                    <td width="150px" :class="{'text-danger':item.planDate.noUpdate}">{{item.planDate.content}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button v-if="isChrome" type="button" @click="exportPic" class="btn btn-primary" data-toggle="tooltip" data-placement="right"
                            title="小组周计划汇总">导出为CSV</button>
                        <div class="alert alert-danger" v-else>导出文件功能暂时只支持chrome！请换用chrome！</div>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>


    <script>
        window.doCatalogue = false;
    </script>
    <?php include '../_include/jsboot.inc.php' ?>
    <script src="https://cdn1.lncld.net/static/js/av-min-1.2.1.js"></script>
    <script>
        SrcBoot.output([
            'js/lib/vue.js',
            'js/lib/excellentexport.js',
            'js/lib/ztree/jquery.ztree.core.min.js',
            'js/lib/ztree/jquery.ztree.excheck.min.js',
            'js/lib/echarts.common.min.js',
            './rendercharts.js',
            './weeklyreport.js'
        ]);
    </script>
</body>

</html>