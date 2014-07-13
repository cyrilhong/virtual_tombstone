$(function(){
  $.get('/user', function(data){
    console.log(data);
    if(data.code == 99) {
      // not login
    } else {
      // get data
      // e.g. :{_id: "53c29ffd5d87316b1612e42e", oauthID: "255824227949878", name: "Mplus  Lai", email: "azole_pi@pchome.com.tw"}
      // 圖像：利用ajax的方式取得
      // http://graph.facebook.com/[oauthID]/picture?redirect=0&height=200&type=normal&width=200
      // 例如： http://graph.facebook.com/255824227949878/picture?redirect=0&height=200&type=normal&width=200
      $.get('http://graph.facebook.com/'+data.oauthID+'/picture?redirect=0&height=200&type=normal&width=200', function(data){
        console.log(data.data.url);
      });
    }
  });
});
