<template>
  <div>
    <!-- 左对齐 -->
    <div class="userheader">
      <van-row type="flex">
        <van-col span="24">
          <div style="text-align:center">
            <van-image round width="5rem" height="5rem" :src="userinfo.headimgurl" />
            <p>{{userinfo.nickname}}</p>
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="van-hairline--bottom">
      <van-grid :column-num="3">
        <van-grid-item to="/CoinSpraylist">
          <div style="text-align:center;">
            <div>
              <van-image width="3rem" height="3rem" :src="gridImg.icon3" />
            </div>
            <p>预约钣喷:{{car_num.lacqueredNum}}</p>
          </div>
        </van-grid-item>
        <van-grid-item to="/maintenancelist">
          <div style="text-align:center;">
            <div>
              <van-image width="3rem" height="3rem" :src="gridImg.icon1" />
            </div>
            <p>预约维修:{{car_num.maintenanceNum}}</p>
          </div>
        </van-grid-item>
        <van-grid-item to="/maintainlist">
          <div style="text-align:center;">
            <div>
              <van-image width="3rem" height="3rem" :src="gridImg.icon2" />
            </div>
            <p>预约养护:{{car_num.preserveNum}}</p>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
    <van-cell-group>
      <van-cell title="车辆管理" @click="$router.push('vehiclelist')" is-link />
    </van-cell-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      gridImg: {
        icon1: require("../assets/img/icon (1).png"),
        icon2: require("../assets/img/icon (2).png"),
        icon3: require("../assets/img/icon (3).png")
      },
      car_num: {
        lacqueredNum: "0",
        maintenanceNum: "0",
        preserveNum: "0"
      },
      userinfo: {
        nickname: "",
        headimgurl: ""
      },
      
      oepnId: "",
    };
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
    getcarmenu() {
      var openId = "null";
      var params = {
        openId: this.oepnId
      };
      this.axios
        .post("/personal/car_num")
        .then(res => {
          console.log(res);
          this.car_num = res.data.data.list[0];
          console.log(this.car_num);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  mounted() {
    var userinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (userinfo == null) {
      this.getopenID();
    } else {
      this.oepnId = userinfo.openid;
      console.log(userinfo);
    }
    this.getcarmenu();
  }
};
</script>
<style  scoped>
.userheader {
  padding: 15px;
  background: #ffffff;
  background: url("http://img0.imgtn.bdimg.com/it/u=3209478221,3791663447&fm=26&gp=0.jpg");
  height: 167px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.userheader .van-row--flex {
  justify-content: center;
  align-items: center;
}
.userheader p {
  color: #fff;
  font-size: 15px;
  line-height: 30px;
}
</style>