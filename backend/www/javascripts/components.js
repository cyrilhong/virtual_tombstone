/** @jsx React.DOM */
var reactParam = {};
reactParam.tombstoneListMax = 5, // 列出使用者所建立的墓碑最大值
reactParam.tombstoneUrl = 'tombstone.html', // 墓碑資訊路徑
reactParam.buildUrl = 'build.html', // 建立墓碑路徑
reactParam.exploreUrl = 'explore.html', // 瀏覽墓碑路徑
reactParam.loginFbUrl = '/auth/facebook'; // FB 登入路徑

// 未登入的顯示元件
var reactLogout = React.createClass({
  clickHandler: function () {
    $.cookie('beforeLoginURL', location.href.replace(location.origin, ''));
  },
  render: function(){
    return (
      <a className="reactLogout" href={reactParam.loginFbUrl} target="_self" onClick={this.clickHandler}>Facebook Login</a>
    );
  }
});

// 已登入的顯示元件
var reactLogin = React.createClass({
  render: function(){
    return (
      <div className="reactLogin">
        <a href={reactParam.exploreUrl + '?uid=' + this.props.data.userID} target="_self">
          <img src={this.props.data.userPic} alt="face" />
          <p className="ID">{this.props.data.userName}</p>
        </a>
        <div className="profile">
          <reactUserTombstones data={this.props.data.tombstones} />
          <a href="/logout" target="_self" className="logout">log out <i className="fa fa-sign-out"></i></a>
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
          <a href={reactParam.tombstoneUrl + '?vtid=' + tempTombstone.vtID}>
            <img src={tempTombstone.vtPhoto} alt={tempTombstone.vtName} />
            <p>{tempTombstone.vtName}<i className="fa fa-arrow-circle-right"></i></p>
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
  clickLoginHandler: function(){
    $.cookie('beforeLoginURL', location.href.replace(location.origin, ''));
  },
  clickRtMsgHandler: function(){
    TweenMax.to(window, 1, {scrollTo: {y: $('.write')[0].offsetTop}});
  },
  render: function(){
    // 依照登入情況, 切換留言按鈕資訊
    var btnMsg = null;
    if (this.props.data.status === 'login') {
      btnMsg = (
        <a href='javascript:void(0)' target="_self" className="btn_message" onClick={this.clickRtMsgHandler}>
          <span>Leave Something</span>
          <i className="fa fa-arrow-down"></i>
        </a>
      );
    } else {
      btnMsg = (
        <a href={reactParam.loginFbUrl} target="_self" className="btn_message btn_login" onClick={this.clickLoginHandler}>
          <span>留言前請先登入</span>
          <i className="fa fa-sign-in"></i>
        </a>
      );
    };
    return (
      <div className="reactTombstone main_tombstone">
        <img src={this.props.data.vtInfo.vtPhoto} alt={this.props.data.vtInfo.vtName} />
        <h2>{this.props.data.vtInfo.vtName}</h2>
        <p>{this.props.data.vtInfo.vtDes}</p>
        <span className="date">-{this.props.data.vtInfo.vtDate}</span>
        <div className="shadow"></div>
          {btnMsg}
      </div>
    );
  }
});

// 對墓碑留言
var reactMessage = React.createClass({
  getInitialState: function() {
    return {count: 0};
  },
  countLetters: function(e) {
    this.setState({count: this.refs.message.getDOMNode().value.length});
  },
  submitHandle: function() {
    var data = {};
    data.vts_id = this.props.data.msgInfo.vtID;
    data.owner_id = this.props.data.msgInfo.userID;
    data.topic = this.refs.topic.getDOMNode().value.trim();
    data.message = this.refs.message.getDOMNode().value.trim();
    $.when($.post('/vts/' + this.props.data.msgInfo.vtID + '/msgs', data)).then(function(res, status, e) {
      // success
      this.refs.topic.getDOMNode().value = '';
      this.refs.message.getDOMNode().value = '';
      this.setState({count: 0});
      $(this.refs.wire.getDOMNode()).addClass('wire_off');
      $(this.refs.write.getDOMNode()).addClass('fly_away');
      var $bloom = $('.bloom'),
        length = $bloom.length;
      if (length > 0) {
        TweenMax.to(window, 3.2, {scrollTo: {y: $bloom.eq(length - 1)[0].offsetTop}, onComplete: onTweenComplete, onCompleteParams: [this]});
      } else {
        TweenMax.to(window, 3.2, {scrollTo: {y: $('.sky')[0].offsetTop}, onComplete: onTweenComplete, onCompleteParams: [this]});
      };

      function onTweenComplete(reactObj) {
        $(reactObj.refs.wire.getDOMNode()).removeClass('wire_off');
        $(reactObj.refs.write.getDOMNode()).removeClass('fly_away');
      };
    }.bind(this), function() {
      // fail
    });
  },
  render: function(){
    var inlineStyles = {cursor: 'url(../img/scissors.ico),cut'},
      letters = this.state.count;
    return (
      <div className="land">
        <div className="write" ref="write">
          <input placeholder="TOPIC" type="text" ref="topic" />
          <textarea id="write_content" placeholder="Write Something" maxLength={this.props.data.maxLength} onChange={this.countLetters} ref="message"></textarea>
          <div className="restrict">{letters}/144</div>
          <div className="author">by {this.props.data.msgInfo.userName}</div>
          <div className="wire" style={inlineStyles} onClick={this.submitHandle} ref="wire"></div>
        </div>
      </div>
    );
  }
});

// 留言氣球
var reactBlooms = React.createClass({
  render: function(){
    var blooms = this.props.blooms.map(function(item, index, items) {
      return (
        <li className="bloom">
          <div className="info">
            <p className="front">{item.topic}</p>
            <p className="back">{item.message}</p>
          </div>
        </li>
      );
    });
    return (
      <div className="sky">
        <ul>
          {blooms}
        </ul>
      </div>
    );
  }
});
