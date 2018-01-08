/**
 * [归并排序]
 * @param  {[Array]} arr   [要排序的数组]
 * @param  {[String]} prop  [排序字段，用于数组成员是对象时，按照其某个属性进行排序，简单数组直接排序忽略此参数]
 * @param  {[String]} order [排序方式]
 * @return {[Array]}       [排序后数组，新数组，并非在原数组上的修改]
 */
let mergeSort = (function() {
  // 合并
  let _merge = function(left, right, prop) {
    let result = [];

    // 对数组内成员的某个属性排序
    if (prop) {
      while (left.length && right.length) {
        if (left[0][prop] <= right[0][prop]) {
          result.push(left.shift());
        } else {
          result.push(right.shift());
        }
      }
    } else {
      // 数组成员直接排序
      while (left.length && right.length) {
        if (left[0] <= right[0]) {
          result.push(left.shift());
        } else {
          result.push(right.shift());
        }
      }
    }

    while (left.length) result.push(left.shift());

    while (right.length) result.push(right.shift());

    return result;
  };

  let _mergeSort = function(arr, prop) {
    // 采用自上而下的递归方法
    let len = arr.length;
    if (len < 2) {
      return arr;
    }
    let middle = Math.floor(len / 2),
      left = arr.slice(0, middle),
      right = arr.slice(middle);
    return _merge(_mergeSort(left, prop), _mergeSort(right, prop), prop);
  };

  return function(arr, prop, order) {
    let result = _mergeSort(arr, prop);
    if (!order || order.toLowerCase() === 'asc') {
      // 升序
      return result;
    } else {
      // 降序
      let _ = [];
      result.forEach(function(item) {
        _.unshift(item);
      });
      return _;
    }
  };
})();

export default mergeSort;
