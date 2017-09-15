var personData,
    personVM,
    groupData,
    groupQuestionVM,
    groupPlanVM,
    groupMonthPlanVM;
var weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

(function (win) {
    // 应用 ID，用来识别应用
    var APP_ID = 'wnMakl33kYejtmFzQaqr4Gpf-gzGzoHsz';

    // 应用 Key，用来校验权限（Web 端可以配置安全域名来保护数据安全）
    var APP_KEY = 'CGL9EHk2U92w63aeCa0KIpTJ';

    // 初始化
    AV.init({
        appId: APP_ID,
        appKey: APP_KEY
    });
    var isChrome = 'WebkitAppearance' in document.documentElement.style;

    win.today = (function () {
        var d = new Date();

        return d.format('yyyy-MM-dd') + ' ' + weeks[d.getDay()];
    })();

    // 用户选择树中的版本控制
    win.numberVersion = '2017-07-24';
    var GROUPS = [{
        name: 'Front End Support',
        id: '583e87a3a22b9d006ddc5421',
        member: [{
            name: '刘斌',
            id: '583582d0570c35005e412644'
        }, {
            name: '陈东顺',
            id: '58345cd48ac24700639392aa'
        }, {
            name: '蒋金健',
            id: '5968911aac502e006c9526c8'
        }]
    }, {
        name: 'Front End PC',
        // cnName: '',        
        id: '583e87a5ac502e006c35d1be',
        member: [{
            name: '陈刚',
            id: '583582d0da2f6000627e1e9b'
        }, {
            name: '肖龙',
            id: '583582d0d20309005fe4ca48'
        }, {
            name: '施赛博',
            id: '583582d0a22b9d006bc1e22f'
        }, {
            name: '许凌波',
            id: '583582d067f3560065ed61dd'
        }, {
            name: '赵阳',
            id: '583581c6c59e0d0057716f70'
        }, {
            name: '高琰洁',
            id: '58ad3e422f301e006be3a1d7'
        }, {
            name: '骆宇宁',
            id: '58db1cfda22b9d00647a0cdb'
        }, {
            name: '冷圆圆',
            id: '58ad3efada2f6054bd1bd0fc'
        }, {
            name: '高婧',
            id: '58ad3f0dac502e007e9e94a4'
        }, {
            name: '程姣姣',
            id: '58ad3f488ac2476c4d9b2013'
        }, {
            name: '蔡树祥',
            id: '5937b1f1a22b9d005810b97d'
        }, {
            name: '邵海文',
            id: '5968914fa0bb9f0062a189ea'
        }, {
            name: '谢环志',
            id: '59753e908d6d810057cf9810'
        }]
    }, {
        name: 'Front End Mobile',
        // cnName: '移动研发组',
        id: '583e87a8a22b9d006a9956f0',
        member: [{
            name: '马轶轶',
            id: '583582d0d20309005fe4ca46'
        }, {
            name: '郭天琦',
            id: '583582d00ce46300588d3b95'
        }, {
            name: '李波',
            id: '583582d0570c35005e412642'
        }, {
            name: '袁凯忻',
            id: '583582d0570c35005e412645'
        }, {
            name: '司媛媛',
            id: '586f548fac502e0064497ab6'
        }, {
            name: '施静',
            id: '58ad3eceb123db00672d0bb5'
        }, {
            name: '顾家昊',
            id: '58ad400eac502e007e9ea257'
        }, {
            name: '孙家诚',
            id: '596891741b69e6006cb43d23'
        }]
    }];
    win.GROUPS = GROUPS;

    var USERS = (function () {
        var _users = [];
        GROUPS.forEach(function (item, i) {
            // 加入所在小组和小组索引
            item.member.forEach(function (user) {
                user.group = item.name;
                user.groupIndex = i;
            });
            _users = _users.concat(item.member);
        });
        return _users;
    })();
    // 默认全部选中
    USERS.forEach(function (item) {
        item.checked = true;
    });
    // 个人周报填写
    (function () {
        var localUser = JSON.parse(localStorage.getItem('weekReport_curruser'));
        // 默认用户
        var DEFAULT_USER = localUser ? localUser : USERS[0];
        // 默认小组
        var DEFAULT_GROUP = (function () {
            if (!DEFAULT_USER) return GROUPS[0];
            return GROUPS[DEFAULT_USER.groupIndex];
        })();
        // 是否记住人员
        isRememberUser = localStorage.getItem('weekReport_rememberUser') == 'true' ? true : false;

        var TYPES = {
            'task': '实际任务',
            'communication': '沟通管理',
            'study': '学习研究',
            'leave': '请假调休',
            'other': '其他'
        };

        var DEFAULT_TYPE = 'task';

        var CONTENT_TITLE = {
            'task': '任务描述',
            'study': '学习内容',
            'communication': '沟通内容',
            'leave': '请假说明',
            'other': '其他事项'
        };
        var CONTENT_EXPLAIN = {
            'task': '请填写任务名称，并简要说明任务的进展情况，如存在风险，请一并说明。如：招投标大数据平台页面开发，涉及大量图表，部分页面需求还在变更，确定的已完成80%，暂无风险。',
            'study': '请填写学习内容，如：学习handlebars模版引擎，并进行实践。',
            'communication': '请填写沟通内容，如：评审某某的代码，形成评审纪要，并沟通明确整改。',
            'leave': '请如实填写请假缘由，如：近期加班较多，目前手头任务可控，调休一天，自我调节。',
            'other': '除上述明确类型以外的事情。'
        };

        var listIndex = 1;
        var idPre = 'list-';

        var vm = new Vue({
            el: '#report',
            data: {
                // 填写日期
                date: today,
                // 是否在周五填写
                isFriday: (new Date()).getDay() === 5,
                // 小组选择列表
                groupOptions: GROUPS,
                // 当前小组
                group: DEFAULT_GROUP,
                // 当前人员
                user: DEFAULT_USER,
                // 人员列表
                userOptions: USERS,
                // 是否记住人员
                rememberUser: isRememberUser,
                // 当前类型
                type: DEFAULT_TYPE,
                // 类型列表
                typeOptions: TYPES,
                // 工作内容
                content: '',
                // 工作时间
                time: 0,
                // 表单是否初始化状态
                isInit: true,
                // 请假以及其他列表
                leaveList: [],
                // 工作列表
                taskList: [],
                // 学习列表
                studyList: [],
                // 沟通列表
                communicationList: []
            },
            // 实例化后立即调用
            mounted: function () {
                // 检查是否使用本地的 否则立即弹出人员选择
                if (!this.rememberUser) {
                    $('#user-choose').modal('show');
                }
            },
            computed: {
                // 类型列表
                typeOptions: function () {
                    var types = [];
                    for (var v in TYPES) {
                        types.push({
                            value: v,
                            text: TYPES[v]
                        });
                    }

                    return types;
                },

                // 工作内容表单项的样式
                // 用来控制其是否显示验证错误样式
                contentClass: function () {
                    var cclass = 'form-group';
                    if (!this.isInit && this.content.trim() === '') {
                        cclass += ' has-error';
                    }
                    return cclass;
                },
                // 工作时间表单项的样式
                // 用来控制其是否显示验证错误样式
                timeClass: function () {
                    var tclass = 'form-group';
                    if (!this.isInit && (this.time <= 0 || !/^\d+$/.test(this.time))) {
                        tclass += ' has-error';
                    }
                    return tclass;
                },
                workList: function () {
                    return this.taskList.concat(this.studyList, this.communicationList);
                },
                reportList: function () {
                    return this.workList.concat(this.leaveList);
                },
                taskTime: function () {
                    var time = 0,
                        taskList = this.taskList;
                    for (var i = 0, l = taskList.length; i < l; i++) {
                        time += taskList[i].time;
                    }

                    return parseFloat(time.toFixed(0));
                },
                studyTime: function () {
                    var time = 0,
                        studyList = this.studyList;
                    for (var i = 0, l = studyList.length; i < l; i++) {
                        time += studyList[i].time;
                    }

                    return parseFloat(time.toFixed(0));
                },
                communicationTime: function () {
                    var time = 0,
                        communicationList = this.communicationList;
                    for (var i = 0, l = communicationList.length; i < l; i++) {
                        time += communicationList[i].time;
                    }

                    return parseFloat(time.toFixed(0));
                },
                contentTitle: function () {
                    return CONTENT_TITLE[this.type];
                },
                contentExplain: function () {
                    return CONTENT_EXPLAIN[this.type];
                }
            },
            methods: {
                // 人员改变时 本地缓存
                saveName: function () {
                    localStorage.setItem('weekReport_curruser', JSON.stringify(this.user));
                    // 根据是否勾选 更新是否记住
                    localStorage.setItem('weekReport_rememberUser', this.rememberUser);
                    // $('#user-choose').modal('hide');
                },

                // 点击“添加并重置”按钮的处理逻辑
                addItem: function () {
                    // 验证
                    this.isInit = false;
                    if (this.content.trim() === '') {
                        $.zui.messager.show('工作内容不能为空', {
                            placement: 'center',
                            type: 'danger',
                            time: 2000
                        });
                        return;
                    }
                    if (this.time <= 0) {
                        $.zui.messager.show('时间不能小于0', {
                            placement: 'center',
                            type: 'danger',
                            time: 2000
                        });
                        return;
                    }
                    if (!/^\d+$/.test(this.time)) {
                        $.zui.messager.show('时间必须为整数', {
                            placement: 'center',
                            type: 'danger',
                            time: 2000
                        });
                        return;
                    }
                    // 验证通过添加事项
                    // var id = idPre + listIndex++,
                    //     item = {
                    //         id: id,
                    //         type: TYPES[this.type],
                    //         content: this.content.replace(/\r|\n/g, '\t'),
                    //         time: this.time
                    //     };

                    var items = this.content.split(/\n|\r/);
                    //  处理空换行
                    for (var j = 0; j < items.length; j++) {
                        if ($.trim(items[j]) === '') {
                            items.splice(j, 1);
                            j -= 1;
                        }
                    }


                    for (var i = 0, l = items.length; i < l; i++) {
                        var id = idPre + listIndex++,
                            item = {
                                id: id,
                                type: TYPES[this.type],
                                content: items[i],
                                showTime: false,
                                time: parseFloat((this.time / l).toFixed(2))
                            };
                        // 只有逐条添加时才显示时间
                        if (l === 1) item.showTime = true;

                        if (this.type == 'leave' || this.type == 'other') {
                            this.leaveList.push(item);
                        } else if (this.type == 'task') {
                            this.taskList.push(item);
                        } else if (this.type == 'study') {
                            this.studyList.push(item);
                        } else if (this.type == 'communication') {
                            this.communicationList.push(item);
                        }
                    }

                    // 重置表单
                    this.type = DEFAULT_TYPE;
                    this.content = '';
                    this.time = 0;

                    this.isInit = true;

                },

                deletItem: function (id, type) {
                    var list,
                        i = 0,
                        l;

                    switch (type) {
                        case TYPES.task:
                            list = this.taskList;
                            break;
                        case TYPES.study:
                            list = this.studyList;
                            break;
                        case TYPES.communication:
                            list = this.communicationList;
                            break;
                        default:
                            list = this.leaveList;
                    }

                    for (l = list.length; i < l; i++) {
                        if (list[i].id == id) {
                            list.splice(i, 1);
                            return;
                        }
                    }

                },
                saveToClond: function () {

                    if (!this.reportList.length) {
                        $.zui.messager.show('请先添加事项！', {
                            placement: 'center',
                            type: 'warning',
                            time: 2000
                        });
                    } else {
                        var user = this.user,
                            workList = this.workList,
                            leaveList = this.leaveList,
                            taskTime = this.taskTime,
                            studyTime = this.studyTime,
                            communicationTime = this.communicationTime;

                        $.zui.messager.show('你将更新【' + user.name + '】的周报，请点击【确定】按钮继续！', {
                            placement: 'center',
                            type: 'info',
                            time: 60000,
                            actions: [{
                                name: 'ok',
                                icon: 'ok',
                                text: '确认',
                                action: function () { // 点击该操作按钮的回调函数
                                    // 更新到云端
                                    // 更新此对对象 第一个参数是 className，第二个参数是 objectId
                                    var weekReport = AV.Object.createWithoutData('WeekReport', user.id);
                                    // 更新内容
                                    weekReport.set('workList', workList);
                                    weekReport.set('leaveList', leaveList);

                                    weekReport.set('taskTime', taskTime);
                                    weekReport.set('studyTime', studyTime);
                                    weekReport.set('communicationTime', communicationTime);

                                    // 提交
                                    weekReport.save().then(function (data) {
                                        console.log("ok");

                                        $.zui.messager.show('保存成功,您的更新的数据为<pre class="mes-pre">' + JSON.stringify(data.attributes, null, 4) + '</pre>', {
                                            placement: 'top',
                                            type: 'success',
                                            time: 10000
                                        });
                                    }).catch(function (err) {
                                        console.log('error', err);
                                    });
                                }
                            }]
                        });

                    }

                }
            }
        });
    })();

    var localGroup = JSON.parse(localStorage.getItem('weekReport_group'));
    var DEFAULT_GROUP = localGroup ? localGroup : {
        name: '前端框架支撑组',
        id: '583e87a3a22b9d006ddc5421'
    };

    // 小组本月计划填写
    (function () {

        var listIndex = 1;
        var idPre = 'list-';

        var gvm_month_plan = new Vue({
            el: '#group-month-plan',
            data: {
                // 当前小组
                group: DEFAULT_GROUP,
                // 小组列表
                groupOptions: GROUPS,

                content: '',
                // 表单是否初始化状态
                isInit: true,
                // 本月计划
                monthPlanList: []

            },
            computed: {
                // 内容表单项的样式
                // 用来控制其是否显示验证错误样式
                contentClass: function () {
                    var cclass = 'form-group';
                    if (!this.isInit && this.content.trim() === '') {
                        cclass += ' has-error';
                    }
                    return cclass;
                }
            },
            methods: {
                saveGroup: function () {
                    localStorage.setItem('weekReport_group', JSON.stringify(this.group));
                },
                // 添加
                addItem: function () {
                    // 验证
                    this.isInit = false;
                    if (this.content.trim() === '') {
                        $.zui.messager.show('内容不能为空', {
                            placement: 'center',
                            type: 'danger',
                            time: 2000
                        });
                        return;
                    }

                    var items = this.content.split(/\n|\r/);
                    //  处理空换行
                    for (var j = 0; j < items.length; j++) {
                        if ($.trim(items[j]) === '') {
                            items.splice(j, 1);
                            j -= 1;
                        }
                    }


                    for (var i = 0, l = items.length; i < l; i++) {
                        var id = idPre + listIndex++,
                            item = {
                                id: id,
                                content: items[i]
                            };

                        this.monthPlanList.push(item);

                    }


                    // 重置表单
                    this.content = '';

                    this.isInit = true;
                },
                deletItem: function (id, type) {
                    var list,
                        i = 0,
                        l;

                    list = this.monthPlanList;

                    for (l = list.length; i < l; i++) {
                        if (list[i].id == id) {
                            list.splice(i, 1);
                            return;
                        }
                    }
                },
                saveToClond: function () {

                    if (!this.monthPlanList.length) {
                        $.zui.messager.show('请先添加事项！', {
                            placement: 'center',
                            type: 'warning',
                            time: 2000
                        });
                    } else {
                        var groupId = this.group.id,
                            monthPlanList = this.monthPlanList;

                        $.zui.messager.show('你将覆盖更新【' + this.group.name + '】小组的本月计划，请点击【确定】继续！', {
                            placement: 'center',
                            type: 'info',
                            time: 60000,
                            actions: [{
                                name: 'ok',
                                icon: 'ok',
                                text: '确认',
                                action: function () { // 点击该操作按钮的回调函数
                                    // 更新到云端
                                    // 更新此对对象 第一个参数是 className，第二个参数是 objectId
                                    var groupReport = AV.Object.createWithoutData('GroupReport', groupId);
                                    // 更新内容
                                    groupReport.set('monthPlanList', monthPlanList);
                                    // 添加问题更新时间
                                    groupReport.set('monthPlanUpdate', new Date());

                                    // 提交
                                    groupReport.save().then(function (data) {
                                        // console.log("ok");
                                        $.zui.messager.show('保存成功,您的更新的数据为<pre class="mes-pre">' + JSON.stringify(data.attributes, null, 4) + '</pre>', {
                                            placement: 'top',
                                            type: 'success',
                                            time: 10000
                                        });
                                    }).catch(function (err) {
                                        console.log('error', err);
                                    });
                                }
                            }]
                        });


                    }
                }
            }

        });

    })();
    // 小组下周计划填写
    (function () {
        var listIndex = 1;
        var idPre = 'list-';


        var gvm2 = new Vue({
            el: '#group-plan',
            data: {
                // 当前小组
                group: DEFAULT_GROUP,
                // 小组列表
                groupOptions: GROUPS,
                // 记录内容
                content: '',
                // 表单是否初始化状态
                isInit: true,
                // 计划列表
                planList: []
            },
            computed: {
                // 内容表单项的样式
                // 用来控制其是否显示验证错误样式
                contentClass: function () {
                    var cclass = 'form-group';
                    if (!this.isInit && this.content.trim() === '') {
                        cclass += ' has-error';
                    }
                    return cclass;
                }
            },
            methods: {
                saveGroup: function () {
                    localStorage.setItem('weekReport_group', JSON.stringify(this.group));
                },
                // 添加
                addItem: function () {
                    // 验证
                    this.isInit = false;
                    if (this.content.trim() === '') {
                        $.zui.messager.show('内容不能为空', {
                            placement: 'center',
                            type: 'danger',
                            time: 2000
                        });
                        return;
                    }

                    var items = this.content.split(/\n|\r/);
                    //  处理空换行
                    for (var j = 0; j < items.length; j++) {
                        if ($.trim(items[j]) === '') {
                            items.splice(j, 1);
                            j -= 1;
                        }
                    }

                    for (var i = 0, l = items.length; i < l; i++) {
                        var id = idPre + listIndex++,
                            item = {
                                id: id,
                                content: items[i]
                            };
                        this.planList.push(item);
                    }



                    // 重置表单

                    this.content = '';

                    this.isInit = true;
                },
                deletItem: function (id) {
                    var list,
                        i = 0,
                        l;

                    list = this.planList;

                    for (l = list.length; i < l; i++) {
                        if (list[i].id == id) {
                            list.splice(i, 1);
                            return;
                        }
                    }
                },
                saveToClond: function () {

                    if (!this.planList.length) {
                        $.zui.messager.show('请先添加事项！', {
                            placement: 'center',
                            type: 'warning',
                            time: 2000
                        });
                    } else {
                        var groupId = this.group.id,
                            planList = this.planList;

                        $.zui.messager.show('你将更新【' + this.group.name + '】小组的下周计划，请点击【确定】继续！', {
                            placement: 'center',
                            type: 'info',
                            time: 60000,
                            actions: [{
                                name: 'ok',
                                icon: 'ok',
                                text: '确认',
                                action: function () { // 点击该操作按钮的回调函数
                                    // 更新到云端
                                    // 更新此对对象 第一个参数是 className，第二个参数是 objectId
                                    var groupReport = AV.Object.createWithoutData('GroupReport', groupId);
                                    // 更新内容
                                    groupReport.set('planList', planList);
                                    // 添加计划更新时间
                                    groupReport.set('planUpdate', new Date());

                                    // 提交
                                    groupReport.save().then(function (data) {
                                        // console.log("ok");
                                        $.zui.messager.show('保存成功,您的更新的数据为<pre class="mes-pre">' + JSON.stringify(data.attributes, null, 4) + '</pre>', {
                                            placement: 'top',
                                            type: 'success',
                                            time: 10000
                                        });
                                    }).catch(function (err) {
                                        console.log('error', err);
                                    });
                                }
                            }]
                        });


                    }
                }
            }

        });

    })();

    /**
     * 汇总部分
     */
    // var personData,
    //     personVM,
    //     groupData,
    //     groupQuestionVM,
    //     groupPlanVM,
    //     groupMonthPlanVM;

    var GROUPNAMES = ['Front End Support', ' Front End PC', 'Front End Mobile'];

    // 处理个人数据

    var handlePersonData = function (data) {
        var dateSet = {},
            _date;

        var reportList = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var item = data[i];
            var obj = {
                id: item.id,
                updateAt: item.updatedAt,
                name: item.attributes.name,
                groupName: GROUPNAMES[item.attributes.groupId],
                workList: item.attributes.workList || [],
                leaveList: item.attributes.leaveList || [],
                taskTime: item.attributes.taskTime || 0,
                studyTime: item.attributes.studyTime || 0,
                communicationTime: item.attributes.communicationTime || 0,
                saturation: _computeSaturation(item.attributes),
                date: {
                    content: item.updatedAt.format('MM-dd') + '（' + weeks[item.updatedAt.getDay()] + '）'
                },
                defaultSort: i,
                _date: item.updatedAt.format('YYYYMMdd')
            };
            // 统计每个日期的出现的次数
            _date = obj._date;
            dateSet[_date] ? (dateSet[_date]++) : (dateSet[_date] = 1);

            reportList.push(obj);
        }

        // 获取出现次数最多的日期和次数
        var maxDate = '',
            maxCount = 0;
        for (var key in dateSet) {
            if (dateSet.hasOwnProperty(key)) {
                if (dateSet[key] > maxCount) {
                    maxCount = dateSet[key];
                    maxDate = key;
                }
            }
        }

        // 判断是否更新
        for (i = 0, l = reportList.length; i < l; ++i) {
            _date = reportList[i]._date;

            // 如果此日期计数值小于 大多数人的值 且时间更早 则没有更新
            // 日期为YYYYMMdd 的字符串格式，直接进行比较了未进行类型转化
            if ((dateSet[_date] < 0.6 * l) && _date < maxDate) {
                reportList[i].date.noUpdate = true;
            }
        }

        return reportList;
    };
    // 计算工作饱和度
    var _computeSaturation = function (data) {
        var taskTime = data.taskTime || 0,
            communicationTime = data.communicationTime || 0;
        return (taskTime + communicationTime) / 40;
    };

    // 是否本月
    var _isThisMonth = function (date) {
        return date.getMonth() === (new Date()).getMonth();
    };
    // 是否本周
    // 视周一至周日为同一周
    var _isThisWeek = function (date) {
        var updateDate = date.getLastWeekday(),
            nowDate = (new Date()).getLastWeekday();
        return (updateDate.getMonth() === nowDate.getMonth()) && (updateDate.getDate() === nowDate.getDate());
    };

    var _getDateContent = function (date) {
        return date.format('MM-dd') + ' （' + weeks[date.getDay()] + '）';
    };
    /**
     * [归并排序]
     * @param  {[Array]} arr   [要排序的数组]
     * @param  {[String]} prop  [排序字段，用于数组成员是对象时，按照其某个属性进行排序，简单数组直接排序忽略此参数]
     * @param  {[String]} order [排序方式]
     * @return {[Array]}       [排序后数组，新数组，并非在原数组上的修改]
     */
    var mergeSort = (function () {
        // 合并
        var _merge = function (left, right, prop) {
            var result = [];

            // 对数组内成员的某个属性排序
            if (prop) {
                while (left.length && right.length) {
                    if (left[0][prop] <= right[0][prop]) {
                        result.push(left.shift());
                    } else {
                        result.push(right.shift());
                    }
                }
            } else {
                // 数组成员直接排序
                while (left.length && right.length) {
                    if (left[0] <= right[0]) {
                        result.push(left.shift());
                    } else {
                        result.push(right.shift());
                    }
                }
            }

            while (left.length)
                result.push(left.shift());

            while (right.length)
                result.push(right.shift());

            return result;
        };

        var _mergeSort = function (arr, prop) { // 采用自上而下的递归方法
            var len = arr.length;
            if (len < 2) {
                return arr;
            }
            var middle = Math.floor(len / 2),
                left = arr.slice(0, middle),
                right = arr.slice(middle);
            return _merge(_mergeSort(left, prop), _mergeSort(right, prop), prop);
        };

        return function (arr, prop, order) {
            var result = _mergeSort(arr, prop);
            if (!order || order.toLowerCase() === 'asc') {
                // 升序
                return result;
            } else {
                // 降序
                var _ = [];
                result.forEach(function (item) {
                    _.unshift(item);
                });
                return _;
            }
        };
    })();

    //  处理小组数据
    var handleGroupData = function (data) {
        var groupList = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var item = data[i];
            var group = {
                id: item.id,
                groupId: item.attributes.groupId,
                name: item.attributes.groupName,
                // questionList: item.attributes.questionList,
                planList: item.attributes.planList,
                monthPlanList: item.attributes.monthPlanList,

                planDate: {
                    noUpdate: !(_isThisWeek(item.attributes.planUpdate)),
                    content: _getDateContent(item.attributes.planUpdate)
                },
                // 月计划暂时通过是否本月来判断
                monthPlanDate: {
                    noUpdate: !(_isThisMonth(item.attributes.monthPlanUpdate)),
                    content: _getDateContent(item.attributes.monthPlanUpdate)
                }
            };
            // console.log(group.name, group);
            groupList.push(group);
        }
        return groupList;
    };
    // 过滤需要显示的人 源数据 需要显示的数据
    var filterPerson = function (data, showObj) {
        var newData = [];
        data.forEach(function (person, i) {
            // 选中状态则加入
            if (showObj[person.id]) {
                newData.push(person);
            }
        });
        return newData;
    };

    // 个人周报汇总
    var getPersonSummary = function () {
        // 创建查询实例
        var query = new AV.Query('WeekReport');
        // 查询所有记录
        query.exists('objectId');
        // 按小组、成员索引排序，保证顺序一致
        query.addAscending('groupId');
        query.addAscending('memberIndex');
        return query.find().then(function (results) {
            //  处理数据
            personData = handlePersonData(results);

            // 未初始化
            if (!personVM) {
                personVM = new Vue({
                    el: '#person-report',
                    data: {
                        reportList: personData,

                        isChrome: isChrome
                    },
                    watch: {
                        reportList: function (val, oldval) {
                            win.newVal = val;
                            // console.log('change', val, oldval);
                            renderCharts(val);
                        }
                    },
                    filters: {
                        // 小数到百分比过滤器
                        getProportion: function (v) {
                            return (v * 100).toFixed(2) + '%';
                        }
                    },
                    methods: {
                        exportPic: function () {
                            if (this.isChrome) {
                                // if (!this.reportList.length) {
                                //     $.zui.messager.show('请先添加事项！', { placement: 'center', type: 'warning', time: 2000 });
                                // } else {
                                var summary = document.getElementById('person-summary');
                                // var self = this;

                                var save_link = document.createElement('a');
                                ExcellentExport.csv(save_link, "person-summary");
                                save_link.download = (new Date()).format('MM月dd日') + '_个人周报' + '.csv';

                                save_link.click();

                                // }
                            } else {
                                $.zui.messager.show('暂时只支持chrome！', {
                                    placement: 'center',
                                    type: 'warning',
                                    time: 2000
                                });
                            }
                        },
                        // 设置饱和度样式
                        // 0.9~1.2                  绿色
                        // 1.2~1.4 或 0.7~0.9       黄色
                        // 1.4+ 0.7-                红色 加粗
                        getSaturationStyle: function (v) {
                            if (v > 1.4 || v < 0.7) {
                                return 'text-danger text-bold';
                            } else if (v > 1.2) {
                                return 'text-warning';
                            } else if (v >= 0.9) {
                                return 'text-success';
                            } else {
                                return 'text-warning';
                            }
                        },
                        sort: function (e) {
                            var $sort = $(e.target).closest('.js-sort');
                            if ($sort.length === 0) return;
                            var sortFiled = $sort.data('filed');

                            // 点击后循环排序 升、降、初始
                            if ($sort.hasClass('default')) {
                                this.reportList = mergeSort(this.reportList, sortFiled);
                                $sort.removeClass('default').addClass('asc');
                            } else if ($sort.hasClass('asc')) {
                                this.reportList = mergeSort(this.reportList, sortFiled, 'desc');
                                $sort.removeClass('asc').addClass('desc');
                            } else {
                                this.reportList = mergeSort(this.reportList, 'defaultSort');
                                $sort.removeClass('desc').addClass('default');
                            }
                        },
                        saveAndUpdate: function (e) {
                            // 保存到本地
                            personTree.save();
                            // 隐藏
                            personTree.hide();
                            // 过滤显示          
                            var newData = filterPerson(personData, personTree.getData());
                            Vue.set(personVM.$data, 'reportList', newData);
                        }
                    }

                });

            } else {
                // 更新数据
                Vue.set(personVM.$data, 'reportList', personData);
                $('#person-report').find('.js-sort').removeClass('desc').removeClass('asc').addClass('default');
            }

            personTree.init();
            // 过滤不显示的人
            var shownPerson = personTree.getData();
            if (shownPerson) {
                var newData = filterPerson(personData, shownPerson);
                Vue.set(personVM.$data, 'reportList', newData);
            }

        }, function (error) {
            console.log(error);
        });
    };
    /**
     * [getGroupSummary 获取并更新小组汇总数据]
     * @param  {[String]} type [更新时的类型] 取值为【question|plan|任意值】
     * question对应问题汇总，plan为计划汇总 其他值则同时获取更新问题和计划
     * return {[promise]}
     */
    var getGroupSummary = function (type) {
        // 创建查询实例
        var query = new AV.Query('GroupReport');
        // 查询所有记录
        query.exists('objectId');
        // 按小组排序
        query.addAscending('groupId');

        return query.find().then(function (results) {
            // console.log(results);

            groupData = handleGroupData(results);

            // 下周计划
            if (!groupPlanVM) {
                groupPlanVM = new Vue({
                    el: '#plan-summary',
                    data: {
                        groupList: groupData,

                        isChrome: isChrome
                    },
                    methods: {
                        exportPic: function () {
                            if (this.isChrome) {
                                // if (!this.reportList.length) {
                                //     $.zui.messager.show('请先添加事项！', { placement: 'center', type: 'warning', time: 2000 });
                                // } else {
                                var summary = document.getElementById('group-summary2');
                                // var self = this;

                                var save_link = document.createElement('a');
                                ExcellentExport.csv(save_link, "group-summary2");
                                save_link.download = (new Date()).format('MM月dd日') + '_下周计划汇总' + '.csv';

                                save_link.click();

                                // }
                            } else {
                                $.zui.messager.show('暂时只支持chrome！', {
                                    placement: 'center',
                                    type: 'warning',
                                    time: 2000
                                });
                            }
                        }
                    }
                });
            }
            // 本月计划
            if (!groupMonthPlanVM) {
                groupMonthPlanVM = new Vue({
                    el: '#month-plan-summary',
                    data: {
                        groupList: groupData,

                        isChrome: isChrome
                    },
                    methods: {
                        exportPic: function () {
                            if (this.isChrome) {
                                // if (!this.reportList.length) {
                                //     $.zui.messager.show('请先添加事项！', { placement: 'center', type: 'warning', time: 2000 });
                                // } else {
                                var summary = document.getElementById('group-summary3');
                                // var self = this;

                                var save_link = document.createElement('a');
                                ExcellentExport.csv(save_link, "group-summary3");
                                save_link.download = (new Date()).format('MM月dd日') + '_本月计划汇总' + '.csv';

                                save_link.click();

                                // }
                            } else {
                                $.zui.messager.show('暂时只支持chrome！', {
                                    placement: 'center',
                                    type: 'warning',
                                    time: 2000
                                });
                            }
                        }
                    }
                });
            }

            // 更新
            // if (type == 'question') {
            //     Vue.set(groupQuestionVM.$data, 'groupList', groupData);
            // } else
            if (type == 'plan') {
                Vue.set(groupPlanVM.$data, 'groupList', groupData);
            } else if (type == 'monthPlan') {
                Vue.set(groupMonthPlanVM.$data, 'groupList', groupData);
            } else {
                // Vue.set(groupQuestionVM.$data, 'groupList', groupData);
                Vue.set(groupPlanVM.$data, 'groupList', groupData);
                Vue.set(groupMonthPlanVM.$data, 'groupList', groupData);
            }

        }, function (error) {
            console.log(error);
        });

    };

    win.getPersonSummary = getPersonSummary;
    win.getGroupSummary = getGroupSummary;
})(this);

(function () {

    var alreadyLoad = false;
    var tips = new $.zui.Messager('加载数据中...', {
        icon: 'refresh',
        type: 'info',
        time: 0,
        placement: 'center',
        close: false
    });
    $('#view-summary').on('click', function () {
        try {
            new Promise(function () {});
        } catch (e) {
            new $.zui.Messager('需要原生Promise支持，请更换浏览器测试！', {
                icon: 'times',
                type: 'danger',
                placement: 'center',
                time: 10000
            }).show();
            return;
        }
        if (!alreadyLoad) {
            tips.show();


            // 使用原生Promise实现
            Promise.all([getPersonSummary(), getGroupSummary()])
                .then(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                    tips.hide();
                }).catch(function (err) {
                    console.log('error', err);
                    tips.hide();
                    new $.zui.Messager('加载数据失败', {
                        icon: 'info',
                        type: 'danger',
                        placement: 'center',
                        time: 3000
                    }).show();
                });

            alreadyLoad = true;
        }
    });

    $('#summary-page').on('click', '.icon-refresh', function (e) {
        var aim = $(this).data('id');
        var prom,
            type;
        tips.show();
        switch (aim) {
            case 'person':
                type = '个人汇总';
                prom = getPersonSummary();
                break;
                // case 'question':
                //     type = '重点问题汇总';
                //     prom = getGroupSummary('question');
                //     break;
            case 'plan':
                type = '下周计划汇总';
                prom = getGroupSummary('plan');
                break;
            case 'monthPlan':
                type = '本月计划汇总';
                prom = getGroupSummary('monthPlan');
                break;
            default:
                console.log('unknown button');
        }

        if (!prom) return;

        prom.then(function () {
            tips.hide();
            new $.zui.Messager('已更新【' + type + '】！', {
                icon: 'check',
                type: 'success',
                placement: 'center',
                time: 3000
            }).show();
        }).catch(function (err) {
            console.log('error', err);
            tips.hide();
            new $.zui.Messager('加载数据失败', {
                icon: 'info',
                type: 'danger',
                placement: 'center',
                time: 3000
            }).show();
        });
    }).on('mouseenter mouseleave', '.icon-refresh', function (e) {
        var $this = $(this);
        if (e.type === 'mouseenter') {
            $this.addClass('icon-spin');
        } else {
            $this.removeClass('icon-spin');
        }

    });
})();

// 滚动动画
(function () {
    /**
     * [_easeout description] 动画缓动
     * http://www.zhangxinxu.com/wordpress/2017/01/share-a-animation-algorithm-js/
     * @param  {[type]}   start    开始位置
     * @param  {[type]}   end      结束位置
     * @param  {[type]}   rate     缓动速率
     * @param  {Function} callback 回调函数
     * @return {[type]}            description
     */
    var _easeout = function (start, end, rate, callback) {
        // 记录结束位置
        var _end = end;
        if (start == end || typeof start != 'number') {
            return;
        }
        end = end || 0;
        rate = rate || 2;

        var step = function () {
            start = start + (end - start) / rate;
            // 原结束位置判断有误
            if (Math.abs(start - _end) < 1) {
                callback(end, true);
                return;
            }
            callback(start, false);
            requestAnimationFrame(step);
        };
        step();
    };

    $('#summary-menu').on('click', 'a', function () {
        var $target = $($(this).data('position'));
        var end = $target.offset().top;

        var doc = document.body.scrollTop !== undefined ? document.body : document.documentElement;
        _easeout(doc.scrollTop, end, 8, function (value) {
            doc.scrollTop = value;
        });
    });
})();
// $('#summary-menu').css('left', $('#summary-page').width() + $('#summary-page').offset().left);
// 过滤显示人员的树
(function () {
    GROUPS.forEach(function (item) {
        item.checked = true;
    });
    var $modal,
        $personTree;

    // 初始化
    function init() {
        if (!$personTree) {
            var localData = JSON.parse(localStorage.getItem('_selectedPerson_'));
            var localData_v = localStorage.getItem('_selectedPerson_v');
            if (localData && localData.length && localData_v === numberVersion) {
                initTree(localData);
            } else {
                initTree($.extend([], GROUPS));
            }
        }
        $modal = $('#showDialog');
    }

    function initTree(data) {
        var treeSetting = {
            check: {
                enable: true
            },
            data: {
                key: {
                    children: 'member',
                    name: 'name'
                }
            }
        };

        $personTree = $.fn.zTree.init($('#person-tree'), treeSetting, data);
        $personTree.expandAll(true);
    }

    // 获取选中的
    function getcheckData() {
        var n = $personTree.getCheckedNodes(true);
        var c = {};
        n.forEach(function (node) {
            if (!node.isParent) {
                c[node.id] = true;
            }
        });
        return c;
    }

    function hide() {
        $modal.modal('hide');
    }

    // 确定后保存至本地
    function saveToLocal() {
        var nodes = $personTree.getNodes();
        localStorage.setItem('_selectedPerson_', JSON.stringify(nodes));
        localStorage.setItem('_selectedPerson_v', numberVersion);
    }
    // 开放方法
    window.personTree = {
        init: init,
        hide: hide,
        getData: getcheckData,
        save: saveToLocal
    };

})();