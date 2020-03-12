// pages/login/login.js
import { DBStorage } from '../../dbStorage/dbStorage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option : null
  },
  /**
   * 获取权限
   */
  getUserInfo:function(e){
    let that = this
    wx.getSetting({
      success(res){
        if (res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success(res){
              console.log('获取信息成功', res.userInfo)
              /////
              var db = new DBStorage()
              var myUserInfo = {
                'name':res.userInfo.nickName,
                'Image':res.userInfo.avatarUrl
              }
              db.storageData("userInfo",myUserInfo)
              /////
              if (that.data.option == 'go'){                // 导航到评论页面  
                wx.navigateTo({
                  url: '../comments/comments',
                })
              }else{                                        // 回到前一个页面
                var pages = getCurrentPages()       // 获取当前页面
                var beforePage = pages[pages.length - 2]  // 前一个页面
                wx.navigateBack({
                  success:function(){
                    beforePage.onLoad()
                  }
                })
              }
              ///////
              that.setData({
                name:res.userInfo.nickName,
                avatarUrl:res.userInfo.avatarUrl
              })
            },
            fail(res){
              console.log("获取用户信息失败", res)
              setTimeout(function(){
                wx.showToast({
                  title: '登录失败，2秒后返回前一个页面',
                })
                wx.navigateBack({
                })
              }, 2000)
            }
          })
        }else{
          console.log("未授权======")
          wx.showToast({
            title: '登录失败，3秒后返回前一个页面',
          })
          setTimeout(function () {
            wx.navigateBack({
            })
          }, 3000)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.option = options.option
    console.log('输出opion : ' + this.data.option)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})