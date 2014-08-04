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
      if (!!$.cookie('status') === false) {
        $.when($.get('/user')).then(function(user, status, e) {
          if (user.code && user.code === 99) {
            logoutStatus(res);
          } else {
            loginStatus(res);
          };
        }, function(fail, status, e) {
          logoutStatus(res);
        });
      } else {
        if ($.cookie('status') === 'login') {
          loginStatus(res);
        } else {
          logoutStatus(res);
        };
      };
    }, function(fail, status, e) {
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

    // login status
    function loginStatus(res) {
      var msgInfo = {};
      React.renderComponent(
        <reactTombstone data={{vtInfo: res, status: 'login'}} />,
        document.getElementById('tombstone')
      );
      msgInfo.userID = $.cookie('userID');
      msgInfo.userName = $.cookie('userName');
      msgInfo.vtID = res._id;
      React.renderComponent(
        <reactMessage data={{msgInfo: msgInfo, maxLength: 144}} />,
        document.getElementById('balloon')
      );
    };

    // logout status
    function logoutStatus(res) {
      React.renderComponent(
        <reactTombstone data={{vtInfo: res, status: 'logout'}} />,
        document.getElementById('balloon')
      );
    };
  };
});