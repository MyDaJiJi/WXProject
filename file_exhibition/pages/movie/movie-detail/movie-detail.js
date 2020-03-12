import { DBStorage } from "../../../dbStorage/dbStorage.js";
import { util } from "../../../util/util.js";
//引入静态数据
var my_data = require("../../../dbStorage/static_data.js")
var app = getApp()

Page({
  data: {
    movieID:'',                             // 电影名称
    movie: {
      movieImg: "../../../image/icon/timg.jpg",
      country: "中国大陆",
      title: "乘风破浪",
      originalTitle: "乘风破浪",
      wishCount: 183030,
      commentCount: 388883,
      year: 2017,
      generes: ".....",
      stars: "邓超",
      score: 6.9,
      director: ".....",
      casts: ".......",
      castsInfo: "......",
      summary: "...."
    },
    //我的代码
    static_data: my_data.static_data
  },
  /**
   * 我的代码
   */
//收藏功能
  onCollection(){
    if (!this.data.static_data.collection){
      this.data.static_data.collection = true;
      //this.data.movie.wishCount += 1;
    }else{
      this.data.static_data.collection = false;
      //this.data.movie.wishCount -= 1;
    }
    
    this.setData({
      movie: this.data.movie,
      static_data: this.data.static_data,
    })
  },
  //点赞功能
  onLike(){
    if( !this.data.static_data.like){
      this.data.static_data.like = true;
      this.data.movie.wishCount += 1;
    }else{
      this.data.static_data.like = false;
      this.data.movie.wishCount -= 1;
    }
    this.setData({
      movie: this.data.movie,
      static_data: this.data.static_data,
    })

  },
  //跳转评论页面功能 
  onComment(){
    var ut = new util()
    // 如果数据不为空，则跳转到品论页面，
    if (ut.isLogin()){
      wx.navigateTo({
        url: '../../comments/comments?movieID=' + this.data.movieID
      })
    }else{
      console.log('用户未登录')
      ////
      wx.showModal({
        title: '提示',
        content: '用户未登录，是否跳转到登录页面',
        success:function(res){
          if (res.confirm){
            wx.navigateTo({
              url: '../../login/login?option=go',
            })
          }else if (res.cancel){
            console.log('不做任何处理')
          }
        }
      })
      /////
    }
  },

  /**我的代码 */
  onLoad:function(options){
    this.data.movieID = options.movieID         // 获取电影ID
    this.setData({
      movie: this.data.movie,
      static_data: this.data.static_data,
    })
  },
})