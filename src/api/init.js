import AV from 'leancloud-storage';
import config from '@/config/av.config.js';

AV.init({
  appId: config.id,
  appKey: config.key,
  masterKey: config.masterKey
});
export default {};
