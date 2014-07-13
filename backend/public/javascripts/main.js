$(function(){
  $.get('/user', function(data){
    console.log(data);
    if(data.code == 99) {
      // not login
    } else {
      // get data
      // e.g. :{oauthID: "255824227949878", name: "Mplus  Lai", created: 1405255725288, _id: "53c2802d0f02283614a89d8c"} 
    }
  });
});
