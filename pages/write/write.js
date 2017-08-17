// write.js
var util = require("../../utils/util.js");
var interval;
var timeout;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    words_display: [],
    words: [],
    cur: ["cur"],
    cur_img: "",
    images: {},
    cur_play: 0,
    quickClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var word = options.word.split(",")
    that.setData({ words_display: word });
    app.write.getBishun(word[0], function (res) {
      console.log(JSON.parse(res.content))
      var words = that.data.words;
      res.imgurl = "http://www.whtlkj.cn/write/writeword/" + res.imgurl + ".png";
      res.content = JSON.parse(res.content).chinese;
      words.push(res);
      that.setData({
        words: words,
        cur_img: res.imgurl
      })
      that.drawFrame(that.data.cur_play);
      that.fill(that.data.cur_play);
      var ctxbg = wx.createCanvasContext("bg");
      ctxbg.drawImage("../../images/write/mi.png", 0, 0, 300, 300);
      ctxbg.draw();
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

  },
  reWrite: function () {
    var that = this;
    if (!this.data.quickClick) { return false }
    this.setData({
      quickClick: false
    })
    for (let i = timeout; i < timeout + 3500; i++) {
      clearTimeout(i);
    }
    setTimeout(function () {
      that.setData({
        quickClick: true
      })
    }, 1000)
    this.drawFrame(this.data.cur_play);
    this.fill(this.data.cur_play);
  },
  changeWord: function (e) {
    var that = this;
    if (!this.data.quickClick) { return false }
    this.setData({
      quickClick: false
    })
    var now = [];
    var index = e.currentTarget.dataset.index;
    now[index] = "cur";
    if (that.data.words[index]){
      that.setData({
        cur: now,
        cur_img: that.data.words[index].imgurl,
        cur_play: index
      })
      var ctx = wx.createCanvasContext("word");
      for (let i = timeout; i < timeout + 3500; i++) {
        clearTimeout(i);
      }
      setTimeout(function () {
        that.setData({
          quickClick: true
        })
      }, 1000)
      that.drawFrame(that.data.cur_play);
      that.fill(that.data.cur_play);
      return false;
    }
    app.write.getBishun(that.data.words_display[index], function (res) {
      var start = util.formatTime(new Date());
      var words = that.data.words;
      res.imgurl = "http://www.whtlkj.cn/write/writeword/" + res.imgurl + ".png";
      res.content = JSON.parse(res.content).chinese;
      words[index] = res;
      that.data.words = words;
      that.setData({
        cur_img: res.imgurl,
        cur: now,
        cur_play: index
      })
      var end = util.formatTime(new Date());
      console.log(start,end);
      var ctx = wx.createCanvasContext("word");
      for (let i = timeout; i < timeout + 3500; i++) {
        clearTimeout(i);
      }
      setTimeout(function () {
        that.setData({
          quickClick: true
        })
      }, 1000)
      that.drawFrame(that.data.cur_play);
      that.fill(that.data.cur_play);
    })
  },
  imageLoad: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    var viewHeight = 93,
      viewWidth = 93 * ratio;
    var image = this.data.images;
    image = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },
  //画底部字
  drawFrame: function (index) {
    var that = this;
    var ctx = wx.createCanvasContext("word");
    ctx.clearRect(0, 0, 300, 300);
    ctx.draw();
    ctx.setFillStyle('white');
    console.log(that.data.words)
    for (var line in that.data.words[index].content.bihua) {
      var bihua_data = that.data.words[index].content.bihua[line];
      ctx.beginPath();
      for (var dot in bihua_data) {
        var x = bihua_data[dot][0] * 300 / 760;
        var y = bihua_data[dot][1] * 300 / 760;
        if (dot == 0) {
          ctx.moveTo(x, y);
        }
        else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.draw(true);
  },
  //填充汉字
  fill: function (index) {
    var that = this;
    var timer = 0;

    // for (let dot in that.data.words[index].bishun[0]) {
    //   var now = that.data.words[index].bishun[0][dot];
    //   var x = now[0] * 300 / 760;
    //   var y = now[1] * 300 / 760;
    //   console.log(x, y);
    //   if (dot == 0) {
    //     ctx.moveTo(x, y)
    //   }
    //   else {
    //     ctx.moveTo(that.data.words[index].bishun[0][dot-1][0] * 300 / 760, that.data.words[index].bishun[0][dot-1][1] * 300 / 760);
    //     ctx.lineTo(x, y);
    //     ctx.stroke();
    //     ctx.draw(true);
    //   }
    // }

    var ctx = wx.createCanvasContext("word");

    // interval = setInterval(function () {
    // 填充汉字
    ctx.setFillStyle('black');
    ctx.setLineWidth(2);
    ctx.setLineCap('round');
    timeout = setTimeout(function () { }, 100);
    for (let line in that.data.words[index].content.bishun) {
      setTimeout(function () {
        for (let dot in that.data.words[index].content.bishun[line]) {
          setTimeout(function () {
            var now = that.data.words[index].content.bishun[line][dot];
            var x = now[0] * 300 / 760;
            var y = now[1] * 300 / 760;
            if (dot == 0) {
              ctx.moveTo(x, y)
            }
            else {
              ctx.moveTo(that.data.words[index].content.bishun[line][dot - 1][0] * 300 / 760, that.data.words[index].content.bishun[line][dot - 1][1] * 300 / 760);
              ctx.lineTo(x, y);
              ctx.stroke();
              ctx.draw(true);
            }
          }, 5 * dot);
        }
      }, timer * 5);
      timer += that.data.words[index].content.bishun[line].length;
    }
    // var temp3 = setTimeout(function () {
    //   timeout.push(temp3);
    //   ctx.clearRect(0, 0, 300, 300);
    //   ctx.draw();
    //   that.drawFrame(index);
    // }, timer * 5 + 500)
    // }, 1000)
  }
})