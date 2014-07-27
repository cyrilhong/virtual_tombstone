/** @jsx React.DOM */
$(function() {
  // 由 Facebook 導回登入成功後，回到登入前的頁面
  if (location.hash === '#_=_') {
    if ($.cookie('beforeLoginURL') && $.cookie('beforeLoginURL') !== '/' && $.cookie('beforeLoginURL') !== '/index.html') {
      location.href = $.cookie('beforeLoginURL');
    };
  };

  var tombstoneListMax = 5, // 列出使用者所建立的墓碑最大值
    tombstoneUrl = 'tombstone.html', // 墓碑資訊路徑
    buildUrl = 'build.html', // 建立墓碑路徑
    exploreUrl = 'explore.html', // 瀏覽墓碑路徑
    LogoutComponent = React.createClass({ // 未登入的顯示元件
      clickLoginHandler: function () {
        $.cookie('beforeLoginURL', location.pathname);
      },
      render: function(){
        return (
          <a href="/auth/facebook" target="_self" onClick={this.clickLoginHandler}>Facebook Login</a>
        );
      }
    }),
    LoginComponent = React.createClass({ // 已登入的顯示元件
      render: function(){
        return (
          <div>
            <a href="javascript:void(0)" target="_self">
              <img src={this.props.data.userPic} alt="face" />
              <p className="ID">{this.props.data.userName}</p>
            </a>
            <div className="profile">
              <TombstoneListComponent data={this.props.data.tombstone} />
              <a href="/logout" target="_self" className="logout">log out <i className="fa fa-sign-out"></i></a>
            </div>
          </div>
        );
      }
    }),
    TombstoneListComponent = React.createClass({ // 使用者的墓碑列表
      render: function(){
        var tombstoneList = [],
          extraLink = null,
          _i = this.props.data.length - 1,
          _count = 0,
          _tempTombstone = {};

        // 組墓碑列表
        for (_i; _i >= 0; _i--) {
          _tempTombstone = this.props.data[_i];
          tombstoneList.push(
            <li>
              <a href={tombstoneUrl + '?vtid=' + _tempTombstone._id}>
                <img src={_tempTombstone.vtPhoto} alt={_tempTombstone.vtName} />
                <p>{_tempTombstone.vtName}<i class="fa fa-arrow-circle-right"></i></p>
              </a>
            </li>
          );
          _count++;
          if (_count === tombstoneListMax) {
            break;
          };
        };

        // 當完全沒有墓碑時, 新增墓碑
        if (this.props.data.length === 0) {
          extraLink = (
            <a href={buildUrl} target="_self" className="build">BUILD TOMBSTONE</a>
          );
        } else if (this.props.data.length > tombstoneListMax) {
          extraLink = (
            <a href={exploreUrl + '?uid=' + _tempTombstone.owner_id} target="_self" className="more">MORE TOMBSTONE</a>
          );
        };
        return (
          <div>
            <ul>
              {tombstoneList}
            </ul>
            {extraLink}
          </div>
        );
      }
    });

  $.when($.get('/user')).then(function(res, status, e) {
    // succes
    if (res.code && res.code === 99) {
      // 未登入 HTML 的結構
      React.renderComponent(
        <LogoutComponent data={res} />,
        document.getElementById('login')
      );
    } else {
      // 登入 HTML 的結構
      document.getElementById('login').classList.add('after-login');
      $.when($.get('/user/' + res._id + '/vts'), $.get('http://graph.facebook.com/'+res.oauthID+'/picture?redirect=0&height=200&type=normal&width=200')).then(function(res1, res2) {
        // succes
        React.renderComponent(
          <LoginComponent data={{'userName': res.name, 'userPic': res2[0].data.url, 'tombstone': res1[0]}} />,
          document.getElementById('login')
        );
      }, function(res, status, e) {
        // failure
      });
    };
  }, function(res, status, e) {
    // failure
  });

  /*
  $.get('/user', function(data){
    console.log(data);
    if(data.code == 99) {
      $("#afterLogin").hide();
      $("#beforeLogin").show();
      // not login
    } else {

      var user = data;
      $("#fbDisplayname").html(user.name);

      // get data
      // e.g. :{_id: "53c29ffd5d87316b1612e42e", oauthID: "255824227949878", name: "Mplus  Lai", email: "azole_pi@pchome.com.tw"}
     
      // 取得墓碑
      $.get('vts?user='+data._id, function(data){
        console.log(data);
        for(var i=0;i<data.length;i++) {
          $('<li><a href=virtual_tombstone.html?'+data[i]._id+'><img src="'+data[i].vtPhoto+'" alt="'+data[i].vtName+'"><p>'+data[i].vtName+'<i class="fa fa-arrow-circle-right"></i></p></a></li>').insertBefore('#fbLogout');
        }
      });

      // 頭像：利用ajax的方式取得
      // http://graph.facebook.com/[oauthID]/picture?redirect=0&height=200&type=normal&width=200
      // 例如： http://graph.facebook.com/255824227949878/picture?redirect=0&height=200&type=normal&width=200
      $.get('http://graph.facebook.com/'+user.oauthID+'/picture?redirect=0&height=200&type=normal&width=200', function(data){
        console.log(data.data.url);
        $("#fbPicture").attr("src",data.data.url);
      });

      // 朋友清單
      $.get('https://graph.facebook.com/'+user.oauthID+'/friends?access_token='+user.token, function(data){
        console.log(data);
      });

      // 朋友清單
      $.get('https://graph.facebook.com/'+user.oauthID+'/taggable_friends?access_token='+user.token, function(data){
        console.log(data);
      });

      $("#afterLogin").show();
      $("#beforeLogin").hide();
    }
  });
  */
});
