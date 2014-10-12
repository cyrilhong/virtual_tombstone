/** @jsx React.DOM */
$(function() {
  var vtid = url('?vtid', location.href) || '',
    vtDataUrl = '',
    msgsDataUrl = '';

  if (vtid !== '') {
    vtDataUrl = /vts/ + vtid;
    msgsDataUrl = '/vts/' + vtid + '/msgs';
    // 取得此墓碑的資訊
    $.when($.get(vtDataUrl)).then(function(vt, status, e) {
      // succes
      $.when($.get('/user')).then(function(user, status, e) {
        if (user.code && user.code === 99) {
          logoutStatus(vt);
        } else {
          loginStatus(vt, user);
        };
      }, function(fail, status, e) {
        logoutStatus(vt);
      });
    }, function(fail, status, e) {
      // failure
    });

    // 取得此墓碑的所有留言
    $.when($.get(msgsDataUrl)).then(function(res, status, e) {
      // succes
      React.renderComponent(
        <reactBlooms blooms={res} />,
        document.getElementById('sky')
      );
    }, function(res, status, e) {
      // failure
    });

    // login status
    function loginStatus(res, user) {
      var msgInfo = {};
      React.renderComponent(
        <reactTombstone data={{vtInfo: res, status: 'login', user_id: user._id}} />,
        document.getElementById('tombstone')
      );
      msgInfo.userID = user._id;
      msgInfo.userName = user.name;
      msgInfo.vtID = res._id;
      msgInfo.token = user.token;
      vtInfo = {
        name: res.vtName,
        photo: res.vtPhoto,
        owner_id: res.owner_id
      };
      React.renderComponent(
        <reactMessage data={{msgInfo: msgInfo, vtInfo:vtInfo, maxLength: 144}} />,
        document.getElementById('balloon')
      );
    };

    // logout status
    function logoutStatus(res) {
      React.renderComponent(
        <reactTombstone data={{vtInfo: res, status: 'logout'}} />,
        document.getElementById('tombstone')
      );
    };
  };
});