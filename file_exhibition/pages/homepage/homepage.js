// pages/homepage/homepage.js
import {DBStorage} from "../../dbStorage/dbStorage.js";
import { util } from "../../util/util.js";
const app = getApp()
Page({
  onLoad: function (event) {
    // wx.switchTab({
    //   url: "../movie/movie",
    //   success: function () {
    //     console.log("jump success")
    //   },
    //   fail: function () {
    //     console.log("jump failed")
    //   },
    //   complete: function () {
    //     console.log("jump complete")
    //   }
    // });
    var ut = new util()
    // 如果用户未授权登录，跳转到登录页面
    if (!ut.isLogin()){
      let that = this
      wx.showModal({
        title: '登录',
        content: '您还未登录，是否跳转到登录页面',
        success: function (res) {
          if (res.confirm) {            // 登录
            wx.navigateTo({
              url: '../login/login?option=back',
            })
          }else{                        // 不登录
            that.myNavigate()
          }
        }
      })
    }else{
      // 已登录，直接跳转页面
      this.myNavigate()
    }
    
    
  },
  /**
   * 跳转页面函数
   */
  myNavigate: function(){
    setTimeout(function () {
      wx.switchTab({
        url: "../movie/movie",
        success: function () {
          console.log("jump success")
        },
        fail: function () {
          console.log("jump failed")
        },
        complete: function () {
          console.log("jump complete")
        }
      })
    }, 1000)
  },
  onUnload: function (event) {
    console.log("page is unload")
  },
  onHide: function (event) {
    console.log("page is hide")
  },
})