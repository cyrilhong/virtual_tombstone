$(function(){
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
});