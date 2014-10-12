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
  render: function() {
    return (
      <a className="reactLogout" href={reactParam.loginFbUrl} target="_self" onClick={this.clickHandler}>Facebook Login</a>
    );
  }
});

// 已登入的顯示元件
var reactLogin = React.createClass({
  render: function() {
    return (
      <div className="reactLogin">
        <a href={reactParam.exploreUrl + '?uid=' + this.props.data.userID} target="_self">
          <img src={this.props.data.userPic} alt="face" />
          <p className="ID">{this.props.data.userName}</p>
          <a href="#" class="navi navi001" target="_self" className="navi"><i className="fa fa-bars"></i></a>
        </a>
        <div className="profile">
          <reactUserTombstones data={{tombstones: this.props.data.tombstones, userID: this.props.data.userID}} />
          <a href="/logout" target="_self" className="logout">登出 <i className="fa fa-sign-out"></i></a>
        </div>
      </div>
    );
  }
});

// 使用者的墓碑列表
var reactUserTombstones = React.createClass({
  render: function() {
    var tombstoneList = [],
      extraLink = null,
      tempTombstone = {},
      length = this.props.data.tombstones.length;
    // 組墓碑列表
    for (var i = 0; i < length; i++) {
      if (i === reactParam.tombstoneListMax) {
        break;
      };

      tempTombstone = this.props.data.tombstones[i];
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
    if (this.props.data.tombstones.length === 0) {
      extraLink = (
        <a href={reactParam.buildUrl} target="_self" className="build">BUILD TOMBSTONE</a>
      );
    } else if (this.props.data.tombstones.length > reactParam.tombstoneListMax) {
      extraLink = (
        <a href={reactParam.exploreUrl + '?uid=' + this.props.data.userID} target="_self" className="more">MORE TOMBSTONE</a>
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
  render: function() {
    var tombstoneNodes = this.props.data.map(function(item, index, data) {
      var breath = '';
      if (item.vtMsg >= 20) {
        breath = 'breath3';
      } else if (item.vtMsg >= 10) {
        breath = 'breath2';
      } else if (item.vtMsg >= 5) {
        breath = 'breath1';
      };
      // return (
      //   <div className="tombstone">
      //     <div className="face">
      //       <a href={reactParam.tombstoneUrl + '?vtid=' + item._id}>
      //         <img src={item.vtPhoto} alt={item.vtName} />
      //       </a>
      //       <h2>{item.vtName}</h2>
      //       <p>{item.vtDes}</p>
      //       <span className="date">-{item.vtDate}</span>
      //     </div>
      //     <div className="count">
      //       <img src="img/comment_count.png" alt="" />
      //       <p>{item.vtMsg}</p>
      //     </div>
      //   </div>
      // );
      return (
        <div className="tombstone">
          <div className={'face ' + breath}>
            <a href={reactParam.tombstoneUrl + '?vtid=' + item._id}>
              <img src={item.vtPhoto} alt={item.vtName} />
            </a>
            <h2>{item.vtName}</h2>
            <p>{item.vtDes}</p>
            <span className="date">-{item.vtDate}</span>
          </div>
          <div className="count"></div>
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
  clickLoginHandler: function() {
    $.cookie('beforeLoginURL', location.href.replace(location.origin, ''));
  },
  clickRtMsgHandler: function() {
    $('.wire').addClass('animation');
    TweenMax.to(window, 1, {scrollTo: {y: $('.write')[0].offsetTop}});
  },
  render: function() {
    // 依照登入情況, 切換留言按鈕資訊
    var btnMsg = null;
    if (this.props.data.status === 'login') {
      // 登入中
      if (this.props.data.user_id === this.props.data.vtInfo.owner_id) {
        // 使用者瀏覽自己建立的墓碑, 不顯示留言按鈕
        btnMsg = (<span></span>);
      } else {
        // 使用者瀏覽別人的墓碑, 顯示留言按鈕
        btnMsg = (
          <a href='javascript:void(0)' target="_self" className="btn_message" onClick={this.clickRtMsgHandler}>
            <span>Leave Something</span>
            <i className="fa fa-arrow-down"></i>
          </a>
        );
      };
    } else {
      // 未登入
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

// 新增墓碑留言
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
    if (data.topic.length === 0 || data.message.length === 0) {
      alert('請輸入標題與內文');
      return false;
    };
    $.when($.post('/vts/' + this.props.data.msgInfo.vtID + '/msgs', data)).then(function(res, status, e) {
      // 貼文到 FB 上去
      if (!!$('.share-fb input:checked').val()) {
        $.post('https://graph.facebook.com/me/feed?message=我留言給 ' + this.props.data.vtInfo.name 
          + ' - ' + data.topic + '  ' + data.message 
          + '&picture=http://virtualtombstone.co/' + this.props.data.vtInfo.photo
          + '&link=http://virtualtombstone.co/tombstone.html?vtid=' + this.props.data.msgInfo.vtID
          + '&access_token=' + this.props.data.msgInfo.token);
      };

      // success
      this.setState({count: 0});
      $(this.refs.wire.getDOMNode()).addClass('wire_off');
      $(this.refs.write.getDOMNode()).addClass('fly_away');
      var $bloom = $('.bloom'),
        length = $bloom.length;
      if (length > 0) {
        TweenMax.to(window, 3.2, {scrollTo: {y: $bloom.eq(length - 1)[0].offsetTop}});
      } else {
        TweenMax.to(window, 3.2, {scrollTo: {y: $('.sky')[0].offsetTop}});
      };
      setTimeout(function() {
        var $bloom = $('.bloom'),
          length = $bloom.length;
        if (length > 0) {
          TweenMax.set(window, {scrollTo: {y: $bloom.eq(length - 1)[0].offsetTop}});
        } else {
          TweenMax.set(window, {scrollTo: {y: $('.sky')[0].offsetTop}});
        };
        $(this.refs.wire.getDOMNode()).removeClass('wire_off');
        $(this.refs.write.getDOMNode()).removeClass('fly_away');
        var html = ''+
          '<li class="bloom">'+
            '<div class="info">'+
              '<p class="front">'+ this.refs.topic.getDOMNode().value.trim() +'</p>'+
              '<p class="back">'+
                '<span>'+ this.refs.message.getDOMNode().value.trim() +'</span>'+
                '<span class="username">'+ this.props.data.msgInfo.userName +'</span>'+
              '</p>'+
            '</div>'+
          '</li>',
          $html = $(html);
        $('.sky ul').packery('destroy').packery().append($html);
        var $pFront = $html.find('.front'),
          $pBack = $html.find('.back'),
          frontMax = Math.max($pFront.width(), $pFront.height()),
          backMax = Math.max($pBack.width(), $pBack.height()),
          max = Math.max(frontMax, backMax);
        $html.width(max);
        $html.height(max);
        $pFront.css({width: $pFront.width(), height: $pFront.height()});
        $pBack.css({width: $pBack.width(), height: $pBack.height()});
        $pFront.addClass('center');
        $pBack.addClass('center');
        $('.sky ul').packery('appended', $html);
        this.refs.topic.getDOMNode().value = '';
        this.refs.message.getDOMNode().value = '';

        $('.wire').removeClass('animation');
      }.bind(this), 3200);
    }.bind(this), function() {
      // fail
    });
  },
  render: function() {
    var inlineStyles = {cursor: 'url(../img/scissors.ico),cut'},
      letters = this.state.count;
    if (this.props.data.msgInfo.userID === this.props.data.vtInfo.owner_id) {
      // 使用者瀏覽自己建立的墓碑, 不顯示留言區塊
      return (<span></span>);
    } else {
      // 使用者瀏覽別人的墓碑, 顯示留言區塊
      return (
        <div className="land">
          <div className="write" ref="write">
            <input placeholder="標題" type="text" ref="topic" />
            <textarea id="write_content" placeholder="留下對紀念碑的留言" maxLength={this.props.data.maxLength} onChange={this.countLetters} ref="message"></textarea>
            <div className="restrict">{letters}/144</div>
            <div className="author">by {this.props.data.msgInfo.userName}</div>
            <label className="share-fb"><input type="checkbox" />同步分享至 Facebook</label>
            <div className="wire" data-wire="剪斷氣球的線讓留言送出" onClick={this.submitHandle} ref="wire"></div>
          </div>
        </div>
      );
    };
  }
});

// 顯示所有氣球
var reactBlooms = React.createClass({
  componentDidMount: function() {
    var bloomsData = this.props,
      bloomsWrapper = this.refs.bloomsWrapper.getDOMNode(),
      bloom = bloomsWrapper.children;
    $.map(bloom, function(item, index) {
      var $item = $(item),
        $pFront = $item.find('.front'),
        $pBack = $item.find('.back'),
        frontMax = Math.max($pFront.width(), $pFront.height()),
        backMax = Math.max($pBack.width(), $pBack.height()),
        max = Math.max(frontMax, backMax);
      $item.width(max);
      $item.height(max);
      $pFront.css({width: $pFront.width(), height: $pFront.height()});
      $pBack.css({width: $pBack.width(), height: $pBack.height()});
      $pFront.addClass('center');
      $pBack.addClass('center');
    });

    $(bloomsWrapper).packery();
  },
  render: function() {
    var blooms = this.props.blooms.map(function(item, index, items) {
      return (
        <reactBloom data={{topic: item.topic, message: item.message, userName: item.owner.name}} />
      );
    });
    return (
      <div className="sky">
        <ul ref="bloomsWrapper">
          {blooms}
        </ul>
      </div>
    );
  }
});

// 顯示單一氣球
var reactBloom = React.createClass({
  render: function() {
    return (
      <li className="bloom">
        <div className="info">
          <p className="front">{this.props.data.topic}</p>
          <p className="back">
            <span>{this.props.data.message}</span>
            <span className="username">{this.props.data.userName}</span>
          </p>
        </div>
      </li>
    );
  }
});