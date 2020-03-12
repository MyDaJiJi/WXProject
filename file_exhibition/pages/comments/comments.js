var my_data = require("../../dbStorage/static_comment.js")
import { DBStorage } from '../../dbStorage/dbStorage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieID : '000',
    comments : my_data.comments,
    my_comment:{
      head_image:'',
      nickname:'',
      comment:''
    }
  },
  //获取输入框内容
  bindSearchInput: function (event) {
    var data = event.detail.value;
    //return data;
    this.data.my_comment.comment = data;
    return data;
  },
  //提交数据
  onSubmit: function(){
    var ID = this.data.movieID
    console.log("输出movieID" + ID)
    console.log("输出ID类型" + typeof(ID))
    var db = new DBStorage()
    this.data.comments.push( this.data.my_comment)
    // 更新数据到缓存中
    var dictionary = db.getStorage('commentsDictionary')
    dictionary[ID] = this.data.comments
    db.storageData('commentsDictionary', dictionary)
    this.setData({
      comments: this.data.comments
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化数据
    var that = this
    that.data.movieID = options.movieID
    var db = new DBStorage()
    // 获取评论字典
    var commentsDictionary = db.getStorage('commentsDictionary')
    if (commentsDictionary == null || commentsDictionary == [] || commentsDictionary == ''){
      commentsDictionary = {}
    }
    // 获取当前电影的评论
    var comments_tmp = commentsDictionary[that.data.movieID]
    if (comments_tmp == null || comments_tmp == [] || comments_tmp == ''){
      console.log('数据为空，使用静态数据')
      comments_tmp = my_data.comments
      // 保存数据到缓存中
      commentsDictionary[that.data.movieID] = comments_tmp
      db.storageData('commentsDictionary', commentsDictionary)
    }else{
      console.log('使用缓存数据')
    }
    // 使用数据
    that.data.comments = comments_tmp
    // 获取用户信息
    var userInfo = db.getStorage('userInfo')
    that.data.my_comment.head_image = userInfo.Image
    that.data.my_comment.nickname = userInfo.name
    // 绑定数据
    that.setData({
      comments: that.data.comments
    })
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