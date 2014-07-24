/** @jsx React.DOM */
$(function() {
  $.get('/vts', function(result){
    var TombstoneBox = React.createClass({
      render: function(){
        var tombstoneNodes = this.props.data.map(function(item, index, data){
          return (
            <div className="tombstone">
              <div className="face">
                <a href="">
                  <img src="" alt={item.vtName} />
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

    React.renderComponent(
      <TombstoneBox data={result} />,
      document.getElementById('main')
    );
  });
});
