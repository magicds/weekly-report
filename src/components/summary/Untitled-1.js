function exportHtml(el, data) {
  // var doc = document.createDocumentFragment();
  // doc.appendChild(el);
  var doc = el.cloneNode(true);
  doc

  const style = `<style>
  .text-center {text-align:center;}
  table {border-collapse: collapse;}
  td,th {border:1px solid #ddd}
  </style>`;

  // 将页面上的图表和转化为图片替换
  var charts = el.querySelectorAll('[_echarts_instance_]');
  [].slice.call(charts).forEach((chartEl, index) => {
    var base64 = chartEl.getElementsByTagName('canvas')[0].toDataURL();
    var img = document.createElement('img');
    img.src = base64;
    doc.querySelectorAll('[_echarts_instance_]')[0].replaceWith(img);
  });

  // json数据
  var pre = document.createElement('pre');
  pre.innerText = JSON.stringify(data);
  doc.appendChild(pre);

  console.log(doc.innerHTML);

  // 下载
  var a = document.createElement('a');
  a.download = '下载.html';
  var blob = new Blob([doc.innerHTML]);
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

exportHtml($0, reports);
