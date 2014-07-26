API:

關於墓碑資料的：

get /vts  取得全部墓碑資料，預計用在 explore 頁面
          http://localhost:3000/vts

get /vts?user=[user_id]  取得 user id 為 user_id 的墓碑資料

get /vts/[vt_id]  取得墓碑 id 是 vt_id 的資料
                  http://localhost:3000/vts/steve_jobs

post /vts  新建立墓碑資料，還差照片上傳

put /vts/[vt_id]  修改墓碑 id 是 vt_id 的資料

delete /vts/[vt_id]  刪除墓碑 id 是 vt_id 的資料

關於訊息資料

get /vts/[vt_id]/msgs  取得關於墓碑 id 為 vt_id 的所有留言
                   http://localhost:3000/vts/steve_jobs/msgs

post /vts/[vt_id]/msgs  建立一筆關於墓碑 id 為 vt_id 的所有留言

/user  取得使用者資料，因為一定要登入後才能取得，所以不用設定使用者 id