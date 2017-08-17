// pages/desktop/desktop.js
var app = getApp();
Page({
  data:
  {
    book:
    {
      total_count: 1,
      count: 0,
      list: []
    },
    readbook:
    {
      count: -1,
      list: []
    },
    loadding: false,
    loadLastId: 0,
    loadMore: true,
    loadMoreCount: 12,
    toPage: true,
    longTimeOver: false,
    showDeleteBtn: false,
    ifShowBtn: false,
    imgHeight: 0,
    ifTrueDel: false,
    bookId: "",
    bookIndex: "",
    nodouble: true,
    backFromSearch: false,
    //修改样式用的data
    isLoading: false,
    userInfo: {},
    now_personNum: 129381,
    selected: ["", "select"]
  },

  //获取在线人数
  /* setOnlineUserNum: function () {
    var that = this;
    app.Dictation.getOnlineUserNum(
      function (res) {
        that.setData({ now_personNum: res });
        wx.stopPullDownRefresh();
      }
    )
  }, */

  onShow: function () {
    const that = this;
    var screenInfo = wx.getSystemInfoSync();
    var screenWidth = screenInfo.windowWidth;
    var itemWidth = ((screenWidth - 20) / 3 - 20) * 1.3
    this.setData({ imgHeight: itemWidth });
    // this.setOnlineUserNum();
    this.hiddenDeleteBtn();
    that.noDel();
    if (that.data.backFromSearch) {
      that.refreshPage();
    }
    //清空数据

    //加载

    //判断网络
    wx.getNetworkType
      ({
        success: function (res) {
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res.networkType;
          if (networkType == "none") {
            wx.showToast({
              title: '网络异常',
              duration: 2000
            });

          }
        }
      });

  },
  onLoad: function (options) {

    var that = this;
    //加载书籍
    this.loadBookList();
    // this.setOnlineUserNum();
    if (options.adviser_id) {
      wx.setStorage({
        key: 'adviser_id',
        data: options.adviser_id,
      })
    }
    // this.showMyBook();
  },


  refreshPage: function () {
    var book = { total_count: 1, count: 0, list: [] };
    this.setData({
      book: book,
      loadding: false,
      loadLastId: 0,
      loadMore: true,
      backFromSearch: true
    });
    //加载
    this.loadBookList();
  },
  onPullDownRefresh: function () {
    var that = this;
    if (this.data.index_if_show == 'index_container') {
      //引导页下拉刷新
      // that.setOnlineUserNum(); 		 		
    } else {
      //正文页下拉刷新
      //清空数据
      var book = { total_count: 1, count: 0, list: [] };
      this.setData({
        book: book,
        loadding: false,
        loadLastId: 0,
        loadMore: true,
      });
      //加载
      this.loadBookList();
    }

  },

  toBookPage: function (event) {
    //允许跳转时才处理
    if (this.data.add_book_way === "add_book_way") {
      return false;
    }
    if (this.data.toPage) {

      if (this.data.nodouble) {
        var book_id = event.currentTarget.dataset.bookId;
        var book_index = event.currentTarget.dataset.bookIndex;
        var that = this;
        wx.setStorageSync("bookId", book_id);
        wx.setStorageSync("ReturnBook", "deskBook")
        var app = function () {
          //数组元素移动，把当前点击的书籍排在第一位
          var new_book = that.data.book;
          var list = new_book.list;
          that.swapArray(list, book_index);

          that.setData({ book: new_book });
        }
        setTimeout(app, 500);

        //console.log("index="+book_index);
        that.data.nodouble = false;
        //禁止1s中内连续打开书籍
        setTimeout(function () { that.data.nodouble = true }, 1000)
        wx.navigateTo({ url: '/pages/book/book?book_id=' + book_id });

      }

    }
    else if (this.data.longTimeOver) {
      //一般为展示删除按钮后，再点击书籍，则需要隐藏删除按钮，并设置为可以跳转到书籍页的状态
      this.longTapReset();
    }


  },
  longTapReset: function () {
    this.data.toPage = true;
    this.setData({ showDeleteBtn: false });
  },
  longTapBook: function (event) {
    var that = this;
    that.setData({
      longTimeOver: false,
      showDeleteBtn: true
    })
    this.data.toPage = false;

    setTimeout(function () { that.setData({ longTimeOver: true, ifShowBtn: true }) }, 1000);
    //长按某本书籍
    // console.log("longTapBook");
  },
  hiddenDeleteBtn: function (event) {
    var that = this;
    if (that.data.ifShowBtn) {
      that.setData({ showDeleteBtn: false, ifShowBtn: false, toPage: true });
    }
    if (this.data.add_book_way === "add_book_way") {
      this.setData({ add_book_way: "not_show" });
    }
  },

  deleteBook: function (event) {
    //点击按钮删除图书
    var book_id = event.currentTarget.dataset.bookId;
    console.log(book_id);
    var book_index = event.currentTarget.dataset.bookIndex;
    this.setData({ ifTrueDel: true, bookId: book_id, bookIndex: book_index });
    this.sureDel();
  },
  noDel: function () {
    this.setData({ ifTrueDel: false });
  },
  sureDel: function () {
    var book_id = this.data.bookId;
    var book_index = this.data.bookIndex;
    var that = this;
    app.Dictation.deleteBook
      (
      book_id,
      function (res) {
        if (res.data.success) {
          var bookdata = that.data.book;
          bookdata.count--;
          bookdata.total_count--;
          bookdata.list.splice(book_index, 1);
          that.setData({ book: bookdata });

          var loadLastId = that.data.loadLastId - 1;
          that.setData({ loadLastId: loadLastId });

          //删除到已经没有书籍时
          console.log(bookdata.total_count)
          if (bookdata.total_count == 0) {
            that.longTapReset();
          }
          /*
          wx.showToast
            (
            {
              title: "删除操作成功！",
              icon: 'success',
              duration: 2000
            }
            )
            */

        }
        else {
          wx.showToast
            (
            {
              title: res.data.message,
              icon: 'success',
              duration: 2000
            }
            )
          that.loadBookList();
        }

      }
      );
    this.setData({ ifTrueDel: false });
  },
  loadBookList: function () {
    //首次加载
    //下来全部刷新
    var that = this;

    //有必要加载更多，且没在请求加载中
    if (!app.globalData.userInfo) {
      setTimeout(that.loadBookList, 100);
    }
    else {
      if (that.data.loadMore && !that.data.loadding) {
        if (app.globalData.userInfo.weixinUser.uid > 0) {
          that.setData({ loadding: true });
          app.Dictation.getDeskBookList
            (
            function (res) {
              var data = res.data;
              var total_count = res.data.length * 1;
              that.setData({
                book: {
                  total_count: total_count,
                  count: 0,
                  list: data
                },
                loadding: false,
                isLoading: true
              })
              wx.stopPullDownRefresh();
            });
        }
      }
    }
  },
  swapArray: function (arr, index1) {
    if (index1 > 0) {

      var item = arr[index1];
      arr.splice(index1, 1);
      arr.splice(0, 0, item);
    }
  },
  //禁止确认删除书籍时其他的点击动作
  stopTouch: function () {
    return false;
  },
  // 选择课本或者输入文字
  selectBook() {
    this.setData({ selected: ["select", ""] });
  },
  selectCustom() {
    this.setData({ selected: ["", "select"] });
  },


  /* 处理输入的文字 */
  splitToArray(event) {
    let charArray = str.split("");
    this.toWriting(charArray);
  },

  /* 跳转到write页面 */
  toWriting(charArray) {
    wx.navigateTo({
      url: '/pages/write/write?charArray',
    })
  }
})
