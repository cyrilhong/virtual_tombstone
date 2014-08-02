/** @jsx React.DOM */
$(function() {
  var uid = url('?uid', location.href) || '', // 使用者 ID
    dataUrl = ''; // 取資料的路徑

  // 當網址有使用者 ID 資訊就列出使用者的所有墓碑, 若無列出 server 中的所有墓碑
  if (uid !== '') {
    dataUrl = '/user/' + uid + '/vts';
  } else {
    dataUrl = '/vts';
  };
  $.when($.get(dataUrl)).then(function(res, status, e) {
    // succes
    React.renderComponent(
      <reactTombstones data={res} />,
      document.getElementById('main')
    );
  }, function(res, status, e) {
    // failure
  });
});
