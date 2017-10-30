import AV from 'leancloud-storage'
import throwError from './error.js'

export default {
  login(name, pwd) {
    return AV.User.logIn(name, pwd)
  },
  signup(name, pwd, email) {
    let user = new AV.User()

    user.setUsername(name)
    user.setPassword(pwd)
    user.setEmail(email)

    return user
      .save()
      .then(user => {
        console.log('注册成功')
        // 注册成功后查询是否为第一个用户 为其添加 管理员角色
        return this.getUsersCount().then(count => {
          if (count > 1) return
          this.addAdminRole(user)
        })
      })
      .catch(throwError)
  },
  getUsersCount() {
    return new AV.Query('_Users').count().catch(throwError)
  },
  /**
   * 为当前用户添加 admin 角色
   * @param {Object} user
   * @returns {Promise}
   */
  createAdminRole(user) {
    // 新建acl权限控制
    let roleAcl = new AV.ACL()
    // 允许公共读、禁止公共写
    roleAcl.setPublicReadAccess(true)
    roleAcl.setPublicWriteAccess(false)

    // 为此用户加入自己的写权限
    roleAcl.setWriteAccess(user, true)

    // 新建角色 并赋值acl
    let administratorRole = new AV.Role('Administrator', roleAcl)
    return administratorRole
      .save()
      .then(role => {
        console.log()
      })
      .catch(throwError)
  },

  getAllUsers() {}
}
