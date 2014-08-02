/** @jsx React.DOM */
$(function() {
  // 由 Facebook 導回登入成功後，回到登入前的頁面
  if (location.hash === '#_=_') {
    if ($.cookie('beforeLoginURL') && $.cookie('beforeLoginURL') !== '/' && $.cookie('beforeLoginURL') !== '/index.html') {
      location.href = $.cookie('beforeLoginURL');
    };
  };

  // 未知狀態
  if (!!$.cookie('status') === false) {
    // 從 server 取得使用者登入狀況, 並顯示對應使用者的墓碑列表
    $.when($.get('/user')).then(function(res, status, e) {
      // succes
      if (res.code && res.code === 99) {
        $.cookie('status', 'logout');
        useReactLogout();
      } else {
        $.when($.get('/user/' + res._id + '/vts'), $.get('http://graph.facebook.com/'+res.oauthID+'/picture?redirect=0&height=200&type=normal&width=200')).then(function(res1, res2) {
          // succes
          var length = res1[0].length,
            i = length - 1,
            count = 0;
          $.cookie('status', 'login');
          $.cookie('userID', res._id);
          $.cookie('userName', res.name);
          $.cookie('userPicture', res2[0].data.url);
          $.cookie('userTombstonesNumber', length > 5 ? 5 : length);
          for (i; i >= 0; i--) {
            $.cookie('vbID' + count, res1[0][i]._id);
            $.cookie('vbName' + count, res1[0][i].vtName);
            $.cookie('vbPhoto' + count, res1[0][i].vtPhoto);
            count++;
            if (count === reactParam.tombstoneListMax) {
              break;
            };
          };
          useReactLogin();
        }, function(res, status, e) {
          // failure
          $.cookie('status', 'logout');
        });
      };
    }, function(res, status, e) {
      // failure
      $.cookie('status', 'logout');
    });
  } else {
    if ($.cookie('status') === 'login') {
      useReactLogin();
    } else {
      useReactLogout();
    };
  };

  // 未登入 HTML 的結構
  function useReactLogout() {
    React.renderComponent(
      <reactLogout />,
      document.getElementById('login')
    );
  };

  // 登入 HTML 的結構
  function useReactLogin() {
    document.getElementById('login').classList.add('after-login');
    var userTombstonesNumber = Number($.cookie('userTombstonesNumber')),
      userTombstones = [];
    for (var i = 0; i < userTombstonesNumber; i++) {
      userTombstones[i] = {};
      userTombstones[i]._id = $.cookie('vbID' + i)
      userTombstones[i].vtName = $.cookie('vbName' + i)
      userTombstones[i].vtPhoto = $.cookie('vbPhoto' + i)
    };
    React.renderComponent(
      <reactLogin data={{'userID': $.cookie('userID'), 'userName': $.cookie('userName'), 'userPic': $.cookie('userPicture'), 'tombstones': userTombstones}} />,
      document.getElementById('login')
    );
  };
});
