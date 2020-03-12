import { DBStorage } from '../dbStorage/dbStorage.js'
class util{
  //http请求
  http( name, url ){
  
    var db = new DBStorage();
    var apikey = "&apikey=0b2bdeda43b5688921839c8ecb20399b";
    url = url + apikey;
    console.log("输出url+apikey", url)
    wx.request({
      //请求信息
      url: url,
      method:'GET',
      header: {
        'Content-Type':'application/xml'
      },
      success:function(res){
        db.storageData(name,res)
      },
      fail:function(error){
       console.log(error)
      }
    });
  }

  // 判断用户是否已登录
  isLogin(){
    var db = new DBStorage;
    var userInfo = db.getStorage('userInfo');
    if (userInfo != [] && userInfo != null && userInfo != ''){
      return true
    }else{
      return false
    }
  }

  //http更普通请求
  https(url,callBack ){
    //测试时保存一些数据到缓存中，防止过多次数访问豆瓣api导致访问被拒绝
    var db = new DBStorage();
    /*
    var storage = db.getStorage("special_movie");
    if ( storage != ''){
      console.log("数据不为空")
      callBack( storage.data.subjects);
      return
    }*/
    var apikey = "&apikey=0b2bdeda43b5688921839c8ecb20399b";
    url = url + apikey;
    wx.request({
      //请求信息
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/xml'
      },
      success: function (res) {
        db.storageData("special_movie",res)
        callBack(res.data.subjects)
      },
      fail: function (error) {
        console.log(error)
      }
    });
  }

  //电影数据处理
  processData( element ){
    var ut = new util();
    var movies = [];
    //格式转换 
    for ( var idx = 0; idx <element.length; idx++){
      
      var title = element[idx].title;
      if ( title.length >= 6){
        title = title.substring(0,6) + "...";
      }                             
      //获取电影对象
      var temp = {
        title: title,
        image: element[idx].images.large,
        average: element[idx].rating.average,
        start:  ut.startChange( element[idx].rating.stars ),
        ID:element[idx].id,
      };
      movies[idx] = temp;
    }
    return movies
  }

  //评分转换
  startChange(starts){
    var array = [];
    var num = starts / 10;
    for ( var i = 1; i <= 5; i++){
      if ( i <= num ){
        array.push(1)
      }else if( (i - num) === 0.5){
        array.push(0.5)
      }else{
        array.push(0)
      }
    }
    return array
  }

  //实现页面跳转
  switchPage(urlT){
    wx.navigateTo({
      url:urlT
    })
  }

  //处理数据
  processDatas(element){
  var db = new DBStorage();
  var allMovies = {}
  var ut = new util();

  //var movies = [];
  //格式转换 
  for (var idx = 0; idx < element.length; idx++) {
    //获取导演
    var director = '';
    for (var dir = 0; dir < element[idx].directors.length; dir++) {
      director = director + " " + element[idx].directors[dir].name;
    }
    //获取演员
    var actor = '';
    for (var act = 0; act < element[idx].casts.length; act++) {
      actor = actor + " " + element[idx].casts[act].name;
    }
    //获取类型
    var Type = '';
    for (var T = 0; T < element[idx].genres.length; T++) {
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
      movie: temp,
      actor_list: actor,
      movie_directors: director,
      type_info: Type,
      year: element[idx].year
    }
    allMovies[idx] = movies;
  }
  return allMovies
  //实现搜索测试所用
  //db.storageData("searchTest", allMovies);

  
    
  }
//柏海
  getDiffTime(recordTime, yearsFlag) {
    if (recordTime) {
      recordTime = new Date(parseFloat(recordTime) * 1000);
      var minute = 1000 * 60,
        hour = minute * 60,
        day = hour * 24,
        now = new Date(),
        diff = now - recordTime;
      var result = '';
      if (diff < 0) {
        return result;
      }
      var weekR = diff / (7 * day);
      var dayC = diff / day;
      var hourC = diff / hour;
      var minC = diff / minute;
      if (weekR >= 1) {
        var formate = 'MM-dd hh:mm';
        if (yearsFlag) {
          formate = 'yyyy-MM-dd hh:mm';
        }
        return recordTime.format(formate);
      }
      else if (dayC == 1 || (hourC < 24 && recordTime.getDate() != now.getDate())) {
        result = '昨天' + recordTime.format('hh:mm');
        return result;
      }
      else if (dayC > 1) {
        var formate = 'MM-dd hh:mm';
        if (yearsFlag) {
          formate = 'yyyy-MM-dd hh:mm';
        }
        return recordTime.format(formate);
      }
      else if (hourC >= 1) {
        result = parseInt(hourC) + '小时前';
        return result;
      }
      else if (minC >= 1) {
        result = parseInt(minC) + '分钟前';
        return result;
      } else {
        result = '刚刚';
        return result;
      }
    }
    return '';
  }

/////////////////////////
  initTimeFormat() {
    Date.prototype.format = function (format) {
      var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
      }
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
      return format;
    };
  }
  
  ///////////////
  convertToStarsArray(stars) {
    var num = stars / 10;
    var array = [];
    for (var i = 1; i <= 5; i++) {
      if (i <= num) {
        array.push(1);
      }
      else {
        if ((i - num) === 0.5) {
          array.push(0.5)
        }
        else {
          array.push(0);
        }
      }
    }
    return array;
  }

// var ut = new util()
//var b = ut.http2(url,callback);
  ///////////////
  http2(url, callBack) {
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function (res) {
        callBack(res.data);
      },
      fail: function (error) {
        console.log(error)
      }
    })
  }

  ///////////
  convertToCastString(casts) {
    var castsjoin = "";
    for (var idx in casts) {
      castsjoin = castsjoin + casts[idx].name + " / ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
  }
///
  convertToCastInfos(casts) {
    var castsArray = []
    for (var idx in casts) {
      var cast = {
        img: casts[idx].avatars ? casts[idx].avatars.large : "",
        name: casts[idx].name
      }
      castsArray.push(cast);
    }
    return castsArray;
  }

};

export {util}


 

/*
 *拓展Date方法。得到格式化的日期形式
 *date.format('yyyy-MM-dd')，date.format('yyyy/MM/dd'),date.format('yyyy.MM.dd')
 *date.format('dd.MM.yy'), date.format('yyyy.dd.MM'), date.format('yyyy-MM-dd HH:mm')
 *使用方法 如下：
 *                       var date = new Date();
 *                       var todayFormat = date.format('yyyy-MM-dd'); //结果为2015-2-3
 *Parameters:
 *format - {string} 目标格式 类似('yyyy-MM-dd')
 *Returns - {string} 格式化后的日期 2015-2-3
 *
 */


//将50、35、00等形式转化成[1,1,1,1,1]的形式




//将数组转换为以 / 分隔的字符串



