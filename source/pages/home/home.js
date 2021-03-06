// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { QuoteferryApi } from "../../apis/quoteferry.api.js";
import { MemberApi } from '../../apis/member.api';
var WxParse = require('../../wxParse/wxParse');

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ currenttab: 0 });
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.info({}, (inst) => {
      that.Base.setMyData(inst);
      
      that.Base.setMyData({ summary: inst.summary });

      wx.setNavigationBarTitle({
        title: inst.summary
      })

      var memberApi = new MemberApi();
      // var mobile = AppBase.UserInfo.mobile;
      // var name = AppBase.UserInfo.name;

      var memberinfo = this.Base.getMyData().memberinfo;
      var info =AppBase.UserInfo.info ;

      console.log(info,"垃圾")
      if(info){
        console.log("略略略");
        console.log(info.company)

        that.Base.setMyData({ userrole_id: info.company });
        
        console.log("略略略");
        var instapi = new InstApi();

        instapi.info({}, (servicelist) => {
          that.Base.setMyData({ servicelist: servicelist });
          WxParse.wxParse('content', 'html', servicelist.content, that, 10);
        });

       // if (info.company == 2) {
          var quoteferryapi = new QuoteferryApi();
          quoteferryapi.listcompany({ status: 2 }, (ret) => {
            this.Base.setMyData({ list_2: ret });
          });
          quoteferryapi.listcompany({ status: 1 }, (ret) => {
            this.Base.setMyData({ list_1: ret });
          });
          quoteferryapi.listcompany({ status: 3 }, (ret) => {
            this.Base.setMyData({ list_3: ret });
          });
       // } 
  
            var memberApi = new MemberApi();

            var quoteferryapi = new QuoteferryApi();
            quoteferryapi.list({ status: 2, mobile: memberinfo.mobile, inst_id: inst.id }, (ret) => {
              this.Base.setMyData({ list_2: ret });
            });
            quoteferryapi.list({ status: 1, mobile: memberinfo.mobile, inst_id: inst.id }, (ret) => {
              this.Base.setMyData({ list_1: ret });
            });
   
      }
      
    });

  
  }


  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({ currenttab: e.detail.current });
  }
  changeTab(e) {
    console.log(e);
   
    this.Base.setMyData({ currenttab: e.currentTarget.id });
  }
  gotoFerryQuote() {
    wx.navigateTo({
      url: '/pages/quoteferry/quoteferry',
    })
  }

  goReply(e){
    //console.log(e)
    wx.navigateTo({
      url: '/pages/reply/reply?id='+e.currentTarget.id,
    })
  }

  goDispatch(e){
    wx.navigateTo({
      url: '/pages/dispatch/dispatch?id=' + e.currentTarget.id,
    })
  }

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }else{
      console.log(res.target)
    }
    return {
      title: this.Base.getMyData().summary,
      path: 'pages/quoteferry/quoteferry'
    }
  }

  jump(){
    wx.navigateToMiniProgram({
      appId: 'wx9bd705284e9af21e',
      path: 'pages/home/home',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  }

  confirmOrder(e) {
    // console.log(e)
    var that = this;
    wx.showModal({
      content: '请确认订单信息',
      success(res) {
        if (res.confirm) {
          var quoteferryapi = new QuoteferryApi();
          quoteferryapi.confirm({
            id: e.target.id
          }, (ret) => {
            console.log(ret)
            that.onMyShow();
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  cancelOrder(e) {
    //console.log(e)
    wx.showModal({
      content: '是否取消订单',
      success(res) {
        if (res.confirm) {
          var quoteferryapi = new QuoteferryApi();
          quoteferryapi.abandon({
            id: e.target.id
          }, (ret) => {
            //console.log(ret)
            this.onMyShow();
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }

  cancelOrder1(e) {
    //console.log(e)
    wx.showModal({
      content: '是否取消询价',
      success(res) {
        if (res.confirm) {
          var quoteferryapi = new QuoteferryApi();
          quoteferryapi.abandon({ id: e.target.id }, (ret) => {
            //console.log(ret)
            this.onMyShow();
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.gotoSearch = content.gotoSearch;
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
body.switchBrand = content.switchBrand;
body.switchPrice = content.switchPrice;
body.switchSize = content.switchSize;
body.gotoFerryQuote = content.gotoFerryQuote;
body.goReply = content.goReply;
body.goDispatch = content.goDispatch;
body.jump = content.jump;

body.cancelOrder = content.cancelOrder;
body.cancelOrder1 = content.cancelOrder1;
body.confirmOrder = content.confirmOrder;

Page(body)