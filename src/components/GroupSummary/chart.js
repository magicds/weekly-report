import echarts from 'echarts/lib/echarts';
/* global require */
require('echarts/lib/chart/bar');
require('echarts/lib/component/grid');
require('echarts/lib/component/title');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/markLine');
require('echarts/lib/component/legend');
require('echarts/lib/component/toolbox');

function getOpt(data) {
  var opt = {
    title: {
      text: `${data.title} 图表`,
      show: true,
      textStyle: {
        color: '#333',
        fontWeight: 'normal',
        fontSize: 16,
        fontFamily: 'Microsoft Yahei'
      }
    },
    legend: {
      type: 'plain',
      data: ['完成率', '延迟率', '额外任务率'],
      align: 'left'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function (data) {
        return data.map(item => {
          return `${item.name}: ${item.marker} ${item.seriesName}: ${(item.value * 100).toFixed(0)}%`
        }).join('<br>');
      }
    },
    grid: {
      left: 50,
      right: 50,
      bottom: 80
    },
    toolbox: {
      show: true,
      right: 50,
      feature: {
        saveAsImage: {
          type: 'png',
          name: `${data.title} 图表`,
          pixelRatio: 3
        },
        dataView: {},
      }
    },
    xAxis: {
      type: 'category',
      data: data.groups,
      // name: '姓名',
      nameRotate: 10,
      axisTick: {
        alignWithLabel: true //坐标轴刻度与标签对齐
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return (value * 100).toFixed(0) + '%';
        }
      }
    },
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
      return idx * 15;
    },
    series: [{
      name: '完成率',
      type: 'bar',
      data: data.done,
      itemStyle: {
        color: '#38b03f'
      }
    }, {
      name: '延迟率',
      type: 'bar',
      data: data.delay,
      itemStyle: {
        color: '#f1a325'
      }
    }, {
      name: '额外任务率',
      type: 'bar',
      data: data.extra,
      itemStyle: {
        color: '#ea644a'
      }
    }]
  };
  opt.series.forEach(item => {
    item.label = {
      normal: {
        show: true,
        position: 'top',
        formatter: function (item) {
          return (item.data * 100).toFixed(0) + '%';
        }
      }
    };
  });
  return opt;
}

function renderChart(el, data) {
  let chart = echarts.getInstanceByDom(el);
  if (!chart) {
    chart = echarts.init(el);
  }
  var opt = getOpt(data);
  chart.setOption(opt);
}

export default renderChart;
