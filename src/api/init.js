import AV from 'leancloud-storage';
import config from '@/config/av.config.js';

var initOptions;
if (config.url.trim() === '') {
  initOptions = {
    appId: config.id,
    appKey: config.key 
  };
} else {
  initOptions = {
    appId: config.id,
    appKey: config.key,
    serverURLs: config.url
  };
}
AV.init(initOptions);
export default {};
