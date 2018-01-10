/**
 * [_easeout description] 动画缓动
 * http://www.zhangxinxu.com/wordpress/2017/01/share-a-animation-algorithm-js/
 * @param  {[type]}   start    [开始位置]
 * @param  {[type]}   end      [结束位置]
 * @param  {[type]}   rate     [缓动速率]
 * @param  {Function} callback [回调函数]
 * @return {[type]}            [description]
 */
var _easeout = function(start, end, rate, callback) {
  if (start == end || typeof start != 'number') {
    return;
  }
  end = end || 0;
  rate = rate || 2;

  var step = function() {
    start = start + (end - start) / rate;
    // 原结束位置判断有误
    if (Math.abs(start - end) < 1) {
      callback(end, true);
      return;
    }
    callback(start, false);
    requestAnimationFrame(step);
  };
  step();
};

export default _easeout;
