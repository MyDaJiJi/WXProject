// pages/movie/movie-search/movie-search.js
import { DBStorage} from "../../../dbStorage/dbStorage.js";
import {util} from "../../../util/util.js";
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 搜索电影功能
   */
  //获取输入框内容
  bindSearchInput: function (event) {
    var data = event.detail.value;
    this.data.movieName = data;
    return data;
  },
  //跳转到查询返回页面
  switchSearchPage: function () {

  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  },


  //请求数据并跳转页面显示
  submit_search: function () {
    var apikey = "&apikey=0b2bdeda43b5688921839c8ecb20399b";
    var urlT = app.globalData.url + "/v2/movie/search?q=" + this.data.movieName + apikey;
    console.log("测试")
    console.log(urlT)

    //保存数据到缓存
    var db = new DBStorage();
    var ut = new util();
    
    wx.request({
      url: urlT,
      method:'GET',
      header:{
        'Content-Type': 'application/xml'
      },

      success:function(res){
        if (res == '') {
          wx.showToast({
            title: '电影不存在',
            duration: 1000
          })
        }
        //保存
        db.storageData("searchData", res.data.subjects);
        ut.switchPage("movie-search");
      },
      fail:function(error){
        wx.showToast({
          title: '查询失败',
          duration: 1000,
        })
        console.log("取出数据失败")
        console.log(error)
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var db = new DBStorage();
    var data = db.getStorage("searchData");
    var ut = new util()
    var movies = ut.processDatas(data);

   // var datas = db.getStorage("searchTest")[0];
    this.setData({
      allMovies: movies
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
    console.log("注销页面")
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