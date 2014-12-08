/** @jsx React.DOM */
$(function() {
  var vtid = url('?vtid', location.href) || '',
    vtDataUrl = '',
    msgsDataUrl = '';

  if (vtid === '')
    return;
  vtDataUrl = /vts/ + vtid;
  msgsDataUrl = '/vts/' + vtid + '/msgs';
  // 取得此墓碑的資訊
  var vt = null;
  for (var i = 0, dLen = vts.length; i < dLen; i++) {
    if (vts[i]._id === vtid) {
      vt = vts[i];
      break;
    }
  }
  if (vt === null)
    return;
  vt.vtPhoto = "./" + vt.vtPhoto;
  logoutStatus(vt);

  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = 'data/msgs/' + vt._id + '.js';
  script.onreadystatechange = getMsgs;
  script.onload = getMsgs;
  document.body.appendChild(script);

  // 取得此墓碑的所有留言
  function getMsgs() {    
    React.renderComponent(
      reactBlooms({
        blooms: msgs
      }),
      document.getElementById('sky')
    );
  }

  // logout status
  function logoutStatus(res) {
    React.renderComponent(
      reactTombstone({
        data: {
          vtInfo: res,
          status: 'logout'
        }
      }),
      document.getElementById('tombstone')
    );
  };
});
