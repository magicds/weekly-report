import AV from 'leancloud-storage';
import config from '@/config/av.config.js';

AV.init({
  appId: config.id,
  appKey: config.key
});
export default {};
