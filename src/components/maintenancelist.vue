<template>
  <div>
    <div class="listCont">
      <van-list v-model="loading"
                :finished="finished"
                @load="onLoad">
        <div v-for="(item, index) in list"
             :key="index">
          <van-card :title="item.plateNumber"
                    :thumb="gridImg.icon2">
            <template #desc>
              <div>
                <p class="cardDesc">预约时间：{{gettime(item.appointmentTime)}}</p>
              </div>
            </template>
          </van-card>
          <van-divider />
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
export default {
  data () {
    return {
      loading: false,
      finished: false,
      list: [],
      gridImg: {
        icon1: require('../assets/img/icon (1).png'),
        icon2: require('../assets/img/icon (2).png'),
        icon3: require('../assets/img/icon (3).png')
      },
      oepnId: "",
    }
  },
  mounted () {
    
    var userinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (userinfo == null) {
      this.getopenID();
    } else {
      this.oepnId = userinfo.openid;
      console.log(userinfo);
    }
    this.getmaintenancelist()
    this.getopenID()
  },
  methods: {
   
    getUrlParam(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
      let r = window.location.search.substr(1).match(reg); // 匹配目标参数
      if (r != null) return decodeURIComponent(r[2]);
      return null; // 返回参数值
    },
    getopenID() {
      let code = this.$route.query.code || this.getUrlParam("code");
      // var state = this.$route.query.state || this.getUrlParam('state')
      var redirectUri = escape(window.location.href + "?state=true");
      var APPID = "wxd5c04a0b457efd8f";
      if (code) {
        var params = {
          code: code
        };
        this.axios
          .get("/api/index/get_openid", { params: params })
          .then(res => {
            var data = res.data;
            localStorage.setItem("userinfo", JSON.stringify(res.data));
            this.oepnId = res.data.data.openid;
            console.log(data);
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        var wxopenidurl =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
          APPID +
          "&redirect_uri=" +
          redirectUri +
          "&response_type=code&scope=snsapi_userinfo&state=true#wechat_redirect";
        window.location.href = wxopenidurl;
      }
    },
    GetRequest (urlStr) {
      var url
      if (typeof urlStr === 'undefined') {
        url = decodeURI(location.search) // 获取url中"?"符后的字符串
      } else {
        url = '?' + urlStr.split('?')[1]
      }
      var theRequest = {}
      if (url.indexOf('?') !== -1) {
        var str = url.substr(1)
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
        }
      }
      return theRequest
    },
    gettime (time) {
      return new Date(parseInt(time) * 1000)
        .toLocaleString()
        .replace(/:\d{1,2}$/, ' ')
    },
    getmaintenancelist () {
      var params = {
        endTime: '99999999999',
        openId: this.openId,
        pageNum: 0,
        pageSize: 1000,
        startTime: '0'
      }
      this.axios
        .post('careful/maintenance_select', params)
        .then(res => {
          console.log(res)
          if (res.data.code !== 10000) {
            Toast.fail(res.data.msg)
          } else {
            this.list = res.data.data.list
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    onLoad () {
      // 异步更新数据
      this.loading = false
      this.finished = true
    },
    onClickLeft () { },
    onClickRight () {
      this.$router.push('maintenance')
    }
  }
}
</script>
<style scoped>
.listCont {
  padding: 15px 15px;
}
.van-card {
  background: #ffffff;
}
.van-card__title {
  font-size: 16px;
}
.cardDesc {
  margin: 17px 0px;
}
</style>
