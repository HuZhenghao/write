//app.js
var service = "http://www.whtlkj.cn/write/"
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  },

  write: {
    //获取笔顺信息
    getBishun: function(word, cb) {
      wx.request({
        url: `${service}getBishun?word=${word}`,
        success: function (res) {
            cb(res.data);
        },
        fail: function (res) {
          wx.showToast
            (
            {
              title: "获取汉字信息失败",
              icon: 'success',
              duration: 2000
            }
            )
        }
      })
    }
  }

})
