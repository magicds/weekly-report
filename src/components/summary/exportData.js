function exportData(el, data, title) {
  var doc = document.createElement('div');

  const style = document.createElement('style');
  style.textContent = `table{border-spacing:0;border-collapse:collapse}.text-muted{color:#808080}.text-gray a,.text-muted a{color:#737373}.text-gray a:hover,.text-muted a:hover,.text-gray a:active,.text-muted a:active{color:#145ccd}.text-primary{color:#3280fc}.text-yellow,.text-warning{color:#f1a325}.text-red,.text-danger{color:#ea644a}.text-green,.text-success{color:#38b03f}.text-blue,.text-info{color:#03b8cf}.text-brown,.text-important{color:#bd7b46}.text-purple,.text-special{color:#8666b8}.text-link{color:#353535}.text-link:hover,.text-link:active{color:#145ccd}.text-left{text-align:left}.text-right{text-align:right}.text-center{text-align:center}.table{width:100%;margin-bottom:20px}.table th,.table td{padding:8px;line-height:1.53846154;vertical-align:top;border-bottom:1px solid #ddd;-webkit-transition:background .2s cubic-bezier(.175,.885,.32,1);-o-transition:background .2s cubic-bezier(.175,.885,.32,1);transition:background .2s cubic-bezier(.175,.885,.32,1)}.table>thead>tr>th{vertical-align:bottom;background-color:#f1f1f1;border-bottom:1px solid #ddd}.table>tbody+tbody{border-top:2px solid #ddd}.table-bordered{border:1px solid #ddd}.table-bordered th,.table-bordered td{border:1px solid #ddd}.table-striped>tbody>tr:nth-child(odd)>td,.table-striped>tbody>tr:nth-child(odd)>th{background-color:#f9f9f9}.table-hover>tbody>tr:hover>td,.table-hover>tbody>tr:hover>th{background-color:#ebf2f9}table col[class*="col-"]{display:table-column;float:none}table td[class*="col-"],table th[class*="col-"]{display:table-cell;float:none}.vertical-middle td, .vertical-middle th{vertical-align:middle}`;
  doc.appendChild(style);

  doc.appendChild(el.querySelector('#person-summary').cloneNode(true));

  // 还原隐藏数据
  [].slice.call(doc.querySelectorAll('ul')).forEach(ul => {
    ul.style.display = 'block';
  });

  // 将页面上的图表转化为图片
  var chartImgArr = [];
  [].slice.call(el.querySelectorAll('[_echarts_instance_]')).forEach(chartEl => {
    var base64 = chartEl.getElementsByTagName('canvas')[0].toDataURL('image/png');
    chartImgArr.push(base64);

    var img = document.createElement('img');
    img.src = base64;
    doc.appendChild(img);
  });

  // json数据
  var pre = document.createElement('pre');
  pre.innerText = JSON.stringify(data, 0, 2);
  pre.className = 'json-data';
  doc.appendChild(pre);

  // 下载
  download(doc.innerHTML, title + '.html');
  download(chartImgArr[0], title + '-成员工作饱和度.png', true);
  download(chartImgArr[1], title + '-小组工作饱和度.png', true);
}

function download(data, filename, isBase64) {
  var a = document.createElement('a');
  a.download = filename;
  a.href = isBase64 ? data : URL.createObjectURL(new Blob([data]));

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
export {download};
export default exportData;

