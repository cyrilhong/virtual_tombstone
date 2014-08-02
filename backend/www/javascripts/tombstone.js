/** @jsx React.DOM */
$(function() {
  var vtid = url('?vtid', location.href) || '',
    vtDataUrl = '',
    msgsDataUrl = '';

  if (vtid !== '') {
    vtDataUrl = /vts/ + vtid;
    msgsDataUrl = '/vts/' + vtid + '/msgs';
    // 取得此墓碑的資訊
    $.when($.get(vtDataUrl)).then(function(res, status, e) {
      // succes
      React.renderComponent(
        <reactTombstone data={res} />,
        document.getElementById('tombstone')
      );
    }, function(res, status, e) {
      // failure
    });

    // 取得此墓碑的所有留言
    $.when($.get(msgsDataUrl)).then(function(res, status, e) {
      // succes
      console.dir(res);
      if (res.length > 0) {
      };
    }, function(res, status, e) {
      // failure
    });
  };
});