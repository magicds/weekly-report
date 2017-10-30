import AV from 'leancloud-storage'

export default {
  login (name,pwd) {
    return AV.User.logIn(name,pwd);
  }
}
