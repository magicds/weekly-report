import AV from 'leancloud-storage';
import throwError from './error.js';
import groupInfo from '@/config/group.config.js';
import dataApi from './data.js';
import Promise from 'bluebird';

window.AV = AV;

export default {
  logIn(name, pwd) {
    return AV.User.logIn(name, pwd);
  },
  getCurrUser() {
    return AV.User.current();
  },
  logOut() {
    return AV.User.logOut();
  },
  signUp(userInfo) {
    let user = new AV.User(),
      groupIndex = userInfo.groupIndex,
      groupName = userInfo.groupName;

    user.setUsername(userInfo.name);
    user.setPassword(userInfo.pwd);
    user.setEmail(userInfo.eamil);

    if (groupIndex != undefined) {
      user.set('groupIndex', groupIndex);
    }
    if (groupName) {
      user.set('groupName', groupName);
    }

    return user
      .signUp()
      .then(user => {
        console.log('注册成功,当前用户为', AV.User.current());
        // 注册成功后查询是否为第一个用户 为其添加 管理员角色
        return this.getUsersCount().then(count => {
          // let promArr = []

          // if (count > 1) {
          //   promArr.push(this.addRole('normal', user))
          // } else {
          //   // 第一个用户进来创建角色
          //   promArr.push(this.createRole('administrator', user))
          //   promArr.push(this.createRole('normal', user))

          // }

          // // 角色创建及相关初始化完成或添加完毕后 为用户添加角色权限控制
          // Promise.all(promArr).then(data => {
          //   this.afterUserSignUp(user)
          // })

          if (count > 1) {
            return this.addRole('normal', user).then(data => {
              return this.afterUserSignUp(user);
            });
          } else {
            return this.initApp(user);
          }
        });
      })
      .catch(throwError);
  },
  getUsersCount() {
    return new AV.Query('_Users').count().catch(throwError);
  },
  /**
   * 创建角色
   * @param {String} name 创建的类型 admin / normal
   * @param {Object} initUser 第一个用户
   * @returns {Promise}
   */
  createRole(name, initUser) {
    // 新建acl权限控制
    let roleAcl = new AV.ACL();
    // 允许公共读、禁止公共写
    roleAcl.setPublicReadAccess(true);
    roleAcl.setPublicWriteAccess(name == 'normal' ? true : false);

    // 此角色可读可写
    roleAcl.setRoleReadAccess(name, true);
    roleAcl.setRoleWriteAccess(name, true);

    // 新建角色 并赋值acl
    let role = new AV.Role(name, roleAcl);

    role.getUsers().add(initUser);

    return role
      .save()
      .then(role => {
        console.log(name, ':', role, '已经创建');
      })
      .catch(throwError);
  },
  /**
   * 为用于添加角色
   * @param {String} name 角色名称 administrator / normal
   * @param {object} user 要添加的用户
   */
  addRole(name, user) {
    let roleQuery = new AV.Query(AV.Role);

    roleQuery.equalTo('name', name);
    roleQuery.equalTo('users', user);

    roleQuery
      .find()
      .then(result => {
        if (result.length) {
          console.log(user, '已经是', name, '角色了');
          return result[0];
        } else {
          let query = new AV.Query(AV.Role);
          query.equalTo('name', name);

          return query.find().then(roles => {
            let role = roles[0];
            role.getUsers().add(user);
            return role.save().then(currRole => {
              console.log('已经为', user, '添加', currRole);
            });
          });
        }
      })
      .catch(throwError);
  },
  /**
   * 用处注册成功后需要为用户这个对象调整自己的权限
   * @param {Object} user 用户
   */
  afterUserSignUp(user) {
    // 用户创建成功后 初始化用户对象的acl权限
    // 自己可修改，管理员可修改
    let userAcl = new AV.ACL();

    userAcl.setPublicReadAccess(true);
    userAcl.setPublicWriteAccess(false);

    userAcl.setWriteAccess(user, true);
    userAcl.setRoleWriteAccess('administrator', true);

    user.setACL(userAcl);

    return user
      .save()
      .then(result => {
        console.log('已经为', user, '初始化好ACL权限');
      })
      .catch(throwError);
  },
  // 初始化创建小组
  initGroups() {
    let arr = [];

    if (groupInfo.groups && groupInfo.groups.length) {
      groupInfo.groups.forEach(item => {
        arr.push(dataApi.addData('Group', item));
      });
    }

    return arr;
  },
  // 用户设值为管理员
  setAsAdmin(user) {
    user.set('isAdmin', true);
    return user.save();
  },
  // 第一个用户注册后的后续操作
  // 先创建两个角色
  // 之后再 初始化创建小组、将角色权限加到此用户身上
  initApp(user) {
    let rolePromises = [
      this.createRole('administrator', user),
      this.createRole('normal', user)
    ];
    rolePromises.push(setAsAdmin(user));
    // 角色创建完成
    return Promise.all(rolePromises)
      .then(() => {
        // 创建小组和角色权限
        let arr = [].concat(this.initGroups());
        arr.push(this.afterUserSignUp(user));
        return Promise.all(arr);
      })
      .then(result => {
        console.log('创建角色和小组完成！');
      });
  }
};
