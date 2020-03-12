// pages/movie/movie.js
import { DBStorage} from '../../dbStorage/dbStorage.js'
import { util } from '../../util/util.js'
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

  //请求数据并跳转页面显示
  submit_search: function () {
    var urlT = app.globalData.url + "/v2/movie/search?q=" + this.data.movieName;
    console.log("测试")
    console.log(urlT)

    //保存数据到缓存
    var db = new DBStorage();
    var ut = new util();
    var apikey = "&apikey=0b2bdeda43b5688921839c8ecb20399b";
    urlT = urlT + apikey;
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
        ut.switchPage("movie-search/movie-search");
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
   * 实现点击 更多 跳转到指定页面
   */ 
  onMore: function(event){
    //movietype属性在 moive-templ-list.wxml中
    var Type = event.currentTarget.dataset.movietype;
    wx.navigateTo({
      url:"special-movie/special-movie?current_type="+Type
    })
  },
  onMovie: function (event) {
    var ID = event.currentTarget.dataset.movieid        // 获取电影 ID
    wx.navigateTo({
      url: "movie-detail/movie-detail?movieID=" + ID
      //
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取对象
   
    var db = new DBStorage();
    var in_Theaters = db.getStorage("in_Theaters").data.subjects;
    var Top250 = db.getStorage("Top250").data.subjects;
    var coming_soon = db.getStorage("coming_soon").data.subjects;
    

    //获取数据
    var utils = new util();
    in_Theaters = utils.processData(in_Theaters);
    Top250 = utils.processData(Top250)
    coming_soon = utils.processData(coming_soon)
    
    /*
    console.log("输出参数")
    console.log(in_Theaters)
    console.log(Top250)
    console.log(coming_soon)
    */

    //设置数据对象
    this.setData({
      in_Theaters:{
        MovieType:"正在热映",
        movies:in_Theaters,
        Type:"in_theaters"
      },
      Top250:{
        MovieType:"豆瓣Top250",
        movies:Top250,
        Type:"top250"
      },
      coming_soon:{
        MovieType:"即将上映",
        movies:coming_soon,
        Type:"coming_soon"
      }
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
   //清除缓存
   console.log("movie.wxml - > onUnload:清除movie.wxml 需要的三个本地缓存")
    wx.removeStorageSync("in_Theaters");
    wx.removeStorageSync("Top250");
    wx.removeStorageSync("coming_soon");

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