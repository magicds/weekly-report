import AV from 'leancloud-storage'
import config from './av.config.js'

AV.init({
  app_id: config.id,
  app_key: config.key
})

export default {}
