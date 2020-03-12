import { DBStorage } from 'dbStorage/dbStorage.js'
import {util } from 'util/util.js'
App({
  globalData:{
    url:"http://localhost",
    g_userInfo:null
  },

  onLaunch:function(){
    //编制初始信息
    var db = new DBStorage();
    var in_thertersUrl = this.globalData.url + "/v2/movie/in_theaters" + "?start=0&count=3";
    var Top250Url = this.globalData.url + "/v2/movie/top250" + "?start=0&count=3";
    var coming_soonUrl = this.globalData.url + "/v2/movie/coming_soon" + "?start=0&count=3";
    //获取并保存信息
    var ut = new util();
    if (db.getStorage('in_Theaters') == ''){
      console.log("更新")
      ut.http("in_Theaters", in_thertersUrl);
    }
    if (db.getStorage('Top250') == '') {
      console.log("更新")
      ut.http("Top250", Top250Url);
    }
    if (db.getStorage('coming_soon') == '') {
      console.log("更新")
      ut.http("coming_soon", coming_soonUrl); 
    }
    ////////////////////////////////////////////////
    wx.login({
      success(res){
        // var code = res.code
        var SECRET = '1ea3a3063ea28790d7fab2d876be9710'
        var appID = 'wx2834789c15193634'
        var URL = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appID + '&secret=' + SECRET + '&js_code=' + res.code + '&grant_type=authorization_code'
        wx.request({
          url:URL,
          method:"get",
          data:{
            code:res.code
          },
          header:{
            'content-type':'application/json'
          },
          success:function(res){
            console.log('#########################')
            console.log('openid : ' + res.data.openid)
            console.log('#########################')
            // that.setData(res.data);
          }
        })
      }
    })
  },
    // _getUserInfo: function () {
    //   var userInfoStorage = wx.getStorageSync('user');
    //   if (!userInfoStorage) {
    //     var that = this;
    //     wx.login({
    //       success: function () {
    //         wx.getUserInfo({
    //           success: function (res) {
    //             console.log(res);
    //             that.globalData.g_userInfo = res.userInfo
    //             wx.setStorageSync('user', res.userInfo)
    //           },
    //           fail: function (res) {
    //             console.log(res);
    //           }
    //         })
    //       }
    //     })
    //   }
    //   else {
    //     this.globalData.g_userInfo = userInfoStorage;
    //   }
    // }  
  
  
})