// dbStorage/dbStorage.js
class DBStorage{
  /*
  *保存数据
  */
  storageData(key, value){
    wx.setStorageSync( key, value);
  }

  /*
  *获取数据
  */
  getStorage( key ){
    return wx.getStorageSync(key);
  }

};
export{DBStorage}