var USERS= [{"id":"583582d0570c35005e412644","name":"刘斌","groupIndex":0,"group":"Front End Support"},{"id":"58345cd48ac24700639392aa","name":"陈东顺","groupIndex":0,"group":"Front End Support"},{"id":"5968911aac502e006c9526c8","name":"蒋金健","groupIndex":0,"group":"Front End Support"},{"id":"583582d0da2f6000627e1e9b","name":"陈刚","groupIndex":1,"group":"Front End PC"},{"id":"583582d0d20309005fe4ca48","name":"肖龙","groupIndex":1,"group":"Front End PC"},{"id":"583582d0a22b9d006bc1e22f","name":"施赛博","groupIndex":1,"group":"Front End PC"},{"id":"583581c6c59e0d0057716f70","name":"赵阳","groupIndex":1,"group":"Front End PC"},{"id":"583582d067f3560065ed61dd","name":"许凌波","groupIndex":1,"group":"Front End PC"},{"id":"58ad3e422f301e006be3a1d7","name":"高琰洁","groupIndex":1,"group":"Front End PC"},{"id":"58db1cfda22b9d00647a0cdb","name":"骆宇宁","groupIndex":1,"group":"Front End PC"},{"id":"58ad3efada2f6054bd1bd0fc","name":"冷圆圆","groupIndex":1,"group":"Front End PC"},{"id":"58ad3f0dac502e007e9e94a4","name":"高婧","groupIndex":1,"group":"Front End PC"},{"id":"58ad3f488ac2476c4d9b2013","name":"程姣姣","groupIndex":1,"group":"Front End PC"},{"id":"5937b1f1a22b9d005810b97d","name":"蔡树祥","groupIndex":1,"group":"Front End PC"},{"id":"5968914fa0bb9f0062a189ea","name":"邵海文","groupIndex":1,"group":"Front End PC"},{"id":"59753e908d6d810057cf9810","name":"谢环志","groupIndex":1,"group":"Front End PC"},{"id":"583582d0d20309005fe4ca46","name":"马轶轶","groupIndex":2,"group":"Front End Mobile"},{"id":"583582d0570c35005e412642","name":"李波","groupIndex":2,"group":"Front End Mobile"},{"id":"583582d0570c35005e412645","name":"袁凯忻","groupIndex":2,"group":"Front End Mobile"},{"id":"583582d00ce46300588d3b95","name":"郭天琦","groupIndex":2,"group":"Front End Mobile"},{"id":"586f548fac502e0064497ab6","name":"司媛媛","groupIndex":2,"group":"Front End Mobile"},{"id":"58ad400eac502e007e9ea257","name":"顾家昊","groupIndex":2,"group":"Front End Mobile"},{"id":"58ad3eceb123db00672d0bb5","name":"施静","groupIndex":2,"group":"Front End Mobile"},{"id":"596891741b69e6006cb43d23","name":"孙家诚","groupIndex":2,"group":"Front End Mobile"}];
var GROUPS = [{"id":"59803db4ac502e0069f92e8c","name":"Front End Support","member":[{"id":"583582d0570c35005e412644","name":"刘斌","groupIndex":0,"group":"Front End Support"},{"id":"58345cd48ac24700639392aa","name":"陈东顺","groupIndex":0,"group":"Front End Support"},{"id":"5968911aac502e006c9526c8","name":"蒋金健","groupIndex":0,"group":"Front End Support"}]},{"id":"59803db7570c350062da819a","name":"Front End PC","member":[{"id":"583582d0da2f6000627e1e9b","name":"陈刚","groupIndex":1,"group":"Front End PC"},{"id":"583582d0d20309005fe4ca48","name":"肖龙","groupIndex":1,"group":"Front End PC"},{"id":"583582d0a22b9d006bc1e22f","name":"施赛博","groupIndex":1,"group":"Front End PC"},{"id":"583581c6c59e0d0057716f70","name":"赵阳","groupIndex":1,"group":"Front End PC"},{"id":"583582d067f3560065ed61dd","name":"许凌波","groupIndex":1,"group":"Front End PC"},{"id":"58ad3e422f301e006be3a1d7","name":"高琰洁","groupIndex":1,"group":"Front End PC"},{"id":"58db1cfda22b9d00647a0cdb","name":"骆宇宁","groupIndex":1,"group":"Front End PC"},{"id":"58ad3efada2f6054bd1bd0fc","name":"冷圆圆","groupIndex":1,"group":"Front End PC"},{"id":"58ad3f0dac502e007e9e94a4","name":"高婧","groupIndex":1,"group":"Front End PC"},{"id":"58ad3f488ac2476c4d9b2013","name":"程姣姣","groupIndex":1,"group":"Front End PC"},{"id":"5937b1f1a22b9d005810b97d","name":"蔡树祥","groupIndex":1,"group":"Front End PC"},{"id":"5968914fa0bb9f0062a189ea","name":"邵海文","groupIndex":1,"group":"Front End PC"},{"id":"59753e908d6d810057cf9810","name":"谢环志","groupIndex":1,"group":"Front End PC"}]},{"id":"59803dbb61ff4b0057f9ed25","name":"Front End Mobile","member":[{"id":"583582d0d20309005fe4ca46","name":"马轶轶","groupIndex":2,"group":"Front End Mobile"},{"id":"583582d0570c35005e412642","name":"李波","groupIndex":2,"group":"Front End Mobile"},{"id":"583582d0570c35005e412645","name":"袁凯忻","groupIndex":2,"group":"Front End Mobile"},{"id":"583582d00ce46300588d3b95","name":"郭天琦","groupIndex":2,"group":"Front End Mobile"},{"id":"586f548fac502e0064497ab6","name":"司媛媛","groupIndex":2,"group":"Front End Mobile"},{"id":"58ad400eac502e007e9ea257","name":"顾家昊","groupIndex":2,"group":"Front End Mobile"},{"id":"58ad3eceb123db00672d0bb5","name":"施静","groupIndex":2,"group":"Front End Mobile"},{"id":"596891741b69e6006cb43d23","name":"孙家诚","groupIndex":2,"group":"Front End Mobile"}]}];

// 编辑组件
Vue.component('user-editor',{
    template:`
    <transition name="slide">
        <div class="person-edit">
            <div class="input-group">
                <span class="input-group-addon"><i class="icon icon-user"></i></span>
                <input type="text" class="form-control" placeholder="姓名" v-model="editUser.name">
            </div>
            <div class="input-group">
                <span class="input-group-addon"><i class="icon icon-group"></i></span>
                <select class="form-control" v-model="editUser.groupIndex">
                    <option v-for="(group,idx) in groups" :value="idx">{{group.name}}</option>
                </select>
            </div>
            <div class="btn-group">
                <button type="button" class="btn btn-primary" @click="save">确认</button>
                <button type="button" class="btn" @click="cancel">取消</button>
            </div>
        </div>
    </transition>`,
    props:['editUser','groups'],
    methods:{
        save:function () {
            console.log(this.editUser);
        },
        cancel:function () {
            this.$emit('cancel');
        }
    }
});
// 人员组件
Vue.component('user-item',{
    template:`
        <div class="card">
            <div :class="inedit? 'person-item in-edit': 'person-item'">
                <div class="person-info">
                    <span class="person-face" v-bind:title="user.name">
                        <span class="face-text">{{user.name | getAsFace}}</span>
                    </span>
                    <span class="person-group">{{user.group}}</span>
                    <div class="person-action">
                        <i class="icon icon-edit" v-on:click="edit"></i>
                    </div> 
                </div>                
                <div class="editor-cover" v-if="inedit">
                    <user-editor v-bind:editUser="editUser" v-bind:groups="groups" v-on:cancel="cancelEdit"></user-editor>
                </div>                
            </div>
        </div>`,
    props:['user','index','groups','edit_id'],
    data:function () {
        return {
            editUser: JSON.parse(JSON.stringify(this.user)),
            inedit:false
        };
    },
    filters:{
        getAsFace:function (v) {
            return v.substr(-2);
        }
    },
    methods:{
        edit: function () {            
            this.$emit('edit', this.user.id, this.index);
            this.inedit=true;
            console.log(this.user.id,this.edit_id);
        },
        cancelEdit:function () {
            this.inedit = false;
        }
    }
});

new Vue({
    el: '#person-list',
    data: {
        users: USERS,
        groups: GROUPS,
        // 新增人员的姓名和小组id
        new_name: '',
        new_groupId: '',
        // 处于新增中
        inAdd:false,
        // 编辑中的人员id
        edit_id:'',
        // 编辑
        editUser:{}
    },
    computed: {
        addNameClass: function () {
            return (this.inAdd && !this.new_name.trim()) ? 'input-group has-error' : 'input-group';
        },
        groupChooseClass: function () {
            return (this.inAdd && !this.new_groupId.trim()) ? 'input-group has-error' : 'input-group';
        }
    },
    methods: {        
        addPerson: function () {
            if(this.inAdd) return;

            this.inAdd = true;

            // 验证

            // 新增成功后重置

        },
        edit:function (id,index) {
            // 处理人员组件的编辑 参数为人员id
            // console.log(id,index);
            this.edit_id = id;
            console.log(this.edit_id);
            // this.inedit=true;
        }
    }
});