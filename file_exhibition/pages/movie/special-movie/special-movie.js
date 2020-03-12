 // pages/movie/special-movie/special-movie.js
import { DBStorage } from '../../../dbStorage/dbStorage.js'
import { util } from '../../../util/util.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start:0,
    count:10,
    movieName:'',
    currentUrl:'',
    allMovies:{}
  },
  /**
   * 搜索电影功能
   */
  //获取输入框内容
  bindSearchInput:function(event){
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
  submit_search:function(){
    var urlT = app.globalData.url + "/v2/movie/search?q=" + this.data.movieName;
    console.log("测试")
    console.log(urlT)

    //保存数据到缓存
    var db = new DBStorage();
    var ut = new util();
    //ut.switchPage("../movie-search/movie-search");
    
    wx.request({
      url: urlT,
      method:'GET',
      header:{
        'Content-Type': 'application/xml'
      },
      success:function(res){
        if ( res == ''){
          wx.showToast({
            title: '电影不存在',
            duration:1000
          })
        }
        //保存
        db.storageData("searchData", res.data.subjects);
        ut.switchPage("../movie-search/movie-search");
      },
      fail:function(error){
        console.log("取出数据失败")
        wx.showToast({
          title: '查询失败',
          duration:1000,
        })
        console.log(error)
      }
    })

  },
  /**
   * 数据处理函数
   */
  processData:function( element){
    var db = new DBStorage();
    var allMovies = {}
    var ut = new util();

    //var movies = [];
    //格式转换 
    for (var idx = 0; idx < element.length; idx++) {
      //获取导演
      var director = '';
      for ( var dir = 0; dir < element[idx].directors.length; dir++){
        director = director + " " + element[idx].directors[dir].name;
      }
      //获取演员
      var actor = '';
      for (var act = 0; act < element[idx].casts.length; act++){
        actor = actor + " " + element[idx].casts[act].name;
      }
      //获取类型
      var Type = '';
      for (var T = 0; T < element[idx].genres.length; T++){
        Type = Type + " " + element[idx].genres[T];
      }
      //获取电影对象
      var temp = {
        title: element[idx].title,
        image: element[idx].images.large,
        average: element[idx].rating.average,
        start: ut.startChange(element[idx].rating.stars),
        ID: element[idx].id,
      };
      //构建一个数组元素
      var movies = {
        movie:temp,
        actor_list:actor,
        movie_directors: director,
        type_info:Type,
        year:element[idx].year
      }
      allMovies[idx] = movies;
    }
    //实现搜索测试所用
    //console.log("保存测试")
    //数据绑定
    console.log("输出totalMovies")
    //var totalMovies =Object.assign(this.data.allMovies, allMovies,{});
    //合并对象列表
    var totalMovies = this.data.allMovies;
    var lenA = Object.keys(allMovies).length;
    var lenT = Object.keys(totalMovies).length;
    for (var i = lenT, j = 0; i < (lenT + lenA); i++, j++){
      totalMovies[i] = allMovies[j];
    }
    this.data.allMovies = totalMovies;
    
    console.log(totalMovies)
    this.setData({
      allMovies:totalMovies
    })

    //结束下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取url
    var current_type = options.current_type;
    var url = app.globalData.url +"/v2/movie/"+ current_type + "?start="+this.data.start+"&count="        +this.data.count;
    this.data.currentUrl = app.globalData.url + "/v2/movie/"+current_type;
    //获取数据
    console.log("special-movie.js ->onLoad")
    var ut = new util();
    ut.https(url, this.processData);
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
    //更新页面缓存信息
    this.data.allMovies = {};
    this.data.start = 0;
    //下拉获取最新数据url
    var url = this.data.currentUrl + "?start="+this.data.start + "&count="+this.data.count;
    console.log("special-movie.js ->onPullDownRefresh")
    //请求http并绑定数据
    var ut = new util();
    ut.https(url, this.processData);
    //提示窗口
   if ( this.data.allMovies != ''){
     wx.showToast({
       title: '刷新成功',
       //icon: 'success',
       duration: 1000,
       mask: true
     })
   }else{
     wx.showToast({
       title: '刷新失败',
       icon: 'success',
       duration: 1000,
       mask: true
     })
   }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //拼接请求url
    var start = this.data.start + 10;
    this.data.start = start;
    var url = this.data.currentUrl + "?start=" + this.data.start + "&count=" + this.data.count;
    console.log("special-movie: -> onReachBottom:")
    var len = Object.keys(this.data.allMovies).length;
    //请求url
    var ut = new util();
    ut.https(url, this.processData);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})