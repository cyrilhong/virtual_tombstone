/** @jsx React.DOM */
var reactParam = {};
reactParam.tombstoneListMax = 5, // 列出使用者所建立的墓碑最大值
reactParam.tombstoneUrl = 'tombstone.html', // 墓碑資訊路徑
reactParam.buildUrl = 'build.html', // 建立墓碑路徑
reactParam.exploreUrl = 'explore.html'; // 瀏覽墓碑路徑
var removeReactCookie = function() {
  var userTombstonesNumber = Number($.cookie('userTombstonesNumber'));
  $.removeCookie('status');
  $.removeCookie('userID');
  $.removeCookie('userName');
  $.removeCookie('userPicture');
  $.removeCookie('userTombstonesNumber');
  for (var i = 0; i < userTombstonesNumber; i++) {
    $.removeCookie('vbID' + i);
    $.removeCookie('vbName' + i);
    $.removeCookie('vbPhoto' + i);
  };
};

// 未登入的顯示元件
var reactLogout = React.createClass({
  clickHandler: function () {
    $.cookie('beforeLoginURL', location.pathname);
    removeReactCookie();
  },
  render: function(){
    return (
      <a className="reactLogout" href="/auth/facebook" target="_self" onClick={this.clickHandler}>Facebook Login</a>
    );
  }
});

// 已登入的顯示元件
var reactLogin = React.createClass({
  clickHandler: function () {
    removeReactCookie();
  },
  render: function(){
    return (
      <div className="reactLogin">
        <a href={reactParam.exploreUrl + '?uid=' + this.props.data.userID} target="_self">
          <img src={this.props.data.userPic} alt="face" />
          <p className="ID">{this.props.data.userName}</p>
        </a>
        <div className="profile">
          <reactUserTombstones data={this.props.data.tombstones} />
          <a href="/logout" target="_self" className="logout" onClick={this.clickHandler}>log out <i className="fa fa-sign-out"></i></a>
        </div>
      </div>
    );
  }
});

// 使用者的墓碑列表
var reactUserTombstones = React.createClass({
  render: function(){
    var tombstoneList = [],
      extraLink = null,
      tempTombstone = {},
      length = this.props.data.length;

    // 組墓碑列表
    for (var i = 0; i < length; i++) {
      tempTombstone = this.props.data[i];
      tombstoneList.push(
        <li>
          <a href={reactParam.tombstoneUrl + '?vtid=' + tempTombstone._id}>
            <img src={tempTombstone.vtPhoto} alt={tempTombstone.vtName} />
            <p>{tempTombstone.vtName}<i class="fa fa-arrow-circle-right"></i></p>
          </a>
        </li>
      );
    };

    // 當完全沒有墓碑時, 新增墓碑
    if (this.props.data.length === 0) {
      extraLink = (
        <a href={reactParam.buildUrl} target="_self" className="build">BUILD TOMBSTONE</a>
      );
    } else if (this.props.data.length > reactParam.tombstoneListMax) {
      extraLink = (
        <a href={reactParam.exploreUrl + '?uid=' + tempTombstone.owner_id} target="_self" className="more">MORE TOMBSTONE</a>
      );
    };
    return (
      <div className="reactUserTombstones">
        <ul>
          {tombstoneList}
        </ul>
        {extraLink}
      </div>
    );
  }
});

// 墓碑列表
var reactTombstones = React.createClass({
  render: function(){
    var tombstoneNodes = this.props.data.map(function(item, index, data){
      return (
        <div className="tombstone">
          <div className="face">
            <a href={reactParam.tombstoneUrl + '?vtid=' + item._id}>
              <img src={item.vtPhoto} alt={item.vtName} />
            </a>
            <h2>{item.vtName}</h2>
            <p>{item.vtDes}</p>
            <span className="date">-{item.vtDate}</span>
          </div>
          <div className="count">
            <img src="img/comment_count.png" alt="" />
            <p>{item.vtMsg}</p>
          </div>
        </div>
      );
    });
    return (
      <div className="reactTombstones">
        {tombstoneNodes}
      </div>
    );
  }
});

// 單一墓碑
var reactTombstone = React.createClass({
  render: function(){
    return (
      <div className="reactTombstone main_tombstone">
        <img src={this.props.data.vtPhoto} alt={this.props.data.vtName} />
        <h2>{this.props.data.vtName}</h2>
        <p>{this.props.data.vtDes}</p>
        <span className="date">-{this.props.data.vtDate}</span>
        <div className="shadow"></div>
        <a href="#go_write" target="_self" className="btn_message btn_login">留言前請先登入
          <i className="fa fa-sign-in"></i>
        </a>
      </div>
    );
  }
});