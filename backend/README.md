啟動
-------------------
```
 mongod --dbpath ./db          
 npm start
```
 1. 目前預設會自己建立假的測試資料 routes/vts.js populateDB      
    等建立資料的表單完成就會移除      

 2. 要修改 mongo 中的測試資料，可以修改 test.js 並執行

API:
-------------------
### 關於墓碑資料的：

# get /vts  取得全部墓碑資料，預計用在 explore 頁面             
          http://localhost:3000/vts

# get /vts?user=[user_id]  取得 user id 為 user_id 的墓碑資料

# get /vts/[vt_id]  取得墓碑 id 是 vt_id 的資料                
                  http://localhost:3000/vts/steve_jobs

post /vts  新建立墓碑資料，還差照片上傳

put /vts/[vt_id]  修改墓碑 id 是 vt_id 的資料

delete /vts/[vt_id]  刪除墓碑 id 是 vt_id 的資料

### 關於訊息資料

get /vts/[vt_id]/msgs  取得關於墓碑 id 為 vt_id 的所有留言            
                   http://localhost:3000/vts/steve_jobs/msgs

post /vts/[vt_id]/msgs  建立一筆關於墓碑 id 為 vt_id 的所有留言    
```
{
  "vts_id": "steve_jobs", // [vt_id]
  "owner_id": [user_id],
  "topic": "test topic2",
  "message": "message2"
}
```
### 關於使用者

/user  取得使用者資料，因為一定要登入後才能取得，所以不用設定使用者 id