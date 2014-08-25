/** @jsx React.DOM */
$(function() {
  // 由 Facebook 導回登入成功後，回到登入前的頁面
  if (location.pathname !== '/login-failed.html' && location.hash === '#_=_') {
    if ($.cookie('beforeLoginURL') && $.cookie('beforeLoginURL') !== '/' && $.cookie('beforeLoginURL') !== '/index.html') {
      location.href = $.cookie('beforeLoginURL');
      return false;
    };
  };

  // 從 server 取得使用者登入狀況, 並顯示對應使用者的墓碑列表
  $.when($.get('/user')).then(function(res, status, e) {
    // succes
    if (res.code && res.code === 99) {
      useReactLogout();
    } else {
      $.when($.get('/user/' + res._id + '/vts'), $.get('http://graph.facebook.com/'+res.oauthID+'/picture?redirect=0&height=200&type=normal&width=200')).then(function(res1, res2) {
        // succes
        var length = res1[0].length,
          i = length - 1,
          count = 0,
          vt = [];
        for (i; i >= 0; i--) {
          vt[count] = {};
          vt[count].vtID = res1[0][i]._id;
          vt[count].vtName = res1[0][i].vtName;
          vt[count].vtPhoto = res1[0][i].vtPhoto;
          count++;
        };
        useReactLogin(res._id, res.name, res2[0].data.url, vt);
      }, function(res, status, e) {
        // failure
      });
    };
  }, function(res, status, e) {
    // failure
  });

  // 未登入 HTML 的結構
  function useReactLogout() {
    React.renderComponent(
      <reactLogout />,
      document.getElementById('login')
    );
  };

  // 登入 HTML 的結構
  function useReactLogin(userID, userName, userPictureURL, vt) {
    document.getElementById('login').classList.add('after-login');
    React.renderComponent(
      <reactLogin data={{'userID': userID, 'userName': userName, 'userPic': userPictureURL, 'tombstones': vt}} />,
      document.getElementById('login')
    );
  };
});
