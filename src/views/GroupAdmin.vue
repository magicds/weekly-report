<template>
  <div type="flex">
    <Row class="row" v-if="groups.length">
      <i-col :key="group.id" :lg="{span:8}" :md="{span:12}" :sm="{span:12}" :xs="{span:24}" style="padding:10px" v-for="group in groups">
        <Card :dis-hover="true">
          <div class="item">
            <!-- <Icon style="margin-right:5px;" type="person-stalker"></Icon> -->
            <span>组名：</span>
            <span>{{group.name}}</span>
          </div>
          <div class="item">
            <!-- <Icon style="margin-right:5px;" type="person-stalker"></Icon> -->
            <span>组长：</span>
            <span class="group-leader-select">
              <i-select v-model="group.leader">
                <i-option :key="user.id" :value="user.id" v-for="user in group.member">{{user.username}}</i-option>
              </i-select>
            </span>
          </div>
          <div class="item">
            <i-button :disabled="originLeader[group.id] === group.leader" :loading="inSaving" @click="save(group)" type="primary">保存</i-button>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { Row, Col } from 'iview/src/components/grid/';
import Icon from 'iview/src/components/icon';
import Card from 'iview/src/components/card/';
import { Select, Option } from 'iview/src/components/select';
import Form from 'iview/src/components/form/';
import Input from 'iview/src/components/input/input';
import Button from 'iview/src/components/button/button';
import AV from 'leancloud-storage';
import api from '@/api/';
export default {
  components: {
    Row,
    Card,
    Icon,
    'i-col': Col,
    'i-button': Button,
    'i-select': Select,
    'i-option': Option,
    'i-form': Form,
    FormItem: Form.Item
  },
  data() {
    return {
      groups: [],
      inSaving: false,
      originLeader: {}
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      api.getAllUserAsTree().then(r => {
        const res = JSON.parse(JSON.stringify(r));
        const originLeader = {};
        res.forEach(g => {
          if (!g.leader) {
            g.leader = '';
          } else {
            g.leader = g.leader.objectId;
          }
          originLeader[g.id] = g.leader;
        });

        this.$set(this, 'originLeader', originLeader);
        this.$set(this, 'groups', res);
      });
    },
    save(group) {
      if (group.leader === this.originLeader[group.id]) {
        return;
      }
      this.inSaving = true;
      const groupObj = AV.Object.createWithoutData('Group', group.id);
      const leaderObj = AV.Object.createWithoutData('_User', group.leader);
      groupObj.set('leader', leaderObj);
      return groupObj.save().then(g => {
        console.log(g);
        this.inSaving = false;
      });
    }
  }
};
</script>

<style scoped>
.item {
  margin: 6px 0;
}
.group-leader-select {
  display: inline-block;
  vertical-align: middle;
  width: 200px;
}
</style>
