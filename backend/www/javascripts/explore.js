/** @jsx React.DOM */
$(function() {
  var tombstoneUrl = 'tombstone.html', // 網頁路徑
    uid = url('?uid', location.href) || '', // 使用者 ID
    dataUrl = '', // 取資料的路徑
    TombstoneBoxComponent = React.createClass({ // 墓碑列表
      render: function(){
        var tombstoneNodes = this.props.data.map(function(item, index, data){
          return (
            <div className="tombstone">
              <div className="face">
                <a href={tombstoneUrl + '?vtid=' + item._id}>
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
          <div className="react_tombstone">
            {tombstoneNodes}
          </div>
        );
      }
    });

  if (uid !== '') {
    dataUrl = '/user/' + uid + '/vts';
  } else {
    dataUrl = '/vts';
  };

  $.when($.get(dataUrl)).then(function(res, status, e) {
    // succes
    React.renderComponent(
      <TombstoneBoxComponent data={res} />,
      document.getElementById('main')
    );
  }, function(res, status, e) {
    // failure
  });
});
