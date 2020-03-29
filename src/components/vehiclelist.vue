<template>
  <div>
    <div class="listCont">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多数据，快去添加" @load="onLoad">
        <div v-for="(item, index) in list" :key="index">
          <van-card :title="item.plateNumber" :thumb="item.image">
            <template #tags>
              <van-tag plain type="danger">{{item.models}}</van-tag>
            </template>
            <template #desc>
              <div>
                <p class="cardDesc">注册日期：{{msToDate(item.registTime*1000).hasTime}}</p>
              </div>
            </template>
          </van-card>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      finished: false,
      list: [],
      oepnId: ""
    };
  },
  mounted() {
    var userinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (userinfo == null) {
      this.getopenID();
    } else {
      this.oepnId = userinfo.openid;
      console.log(userinfo);
    }
    this.getcarlist();
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
    msToDate(msec) {
      let datetime = new Date(msec);
      let year = datetime.getFullYear();
      let month = datetime.getMonth();
      let date = datetime.getDate();
      let hour = datetime.getHours();
      let minute = datetime.getMinutes();
      let second = datetime.getSeconds();

      let result1 =
        year +
        "-" +
        (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
        "-" +
        (date + 1 < 10 ? "0" + date : date) +
        " " +
        (hour + 1 < 10 ? "0" + hour : hour) +
        ":" +
        (minute + 1 < 10 ? "0" + minute : minute) +
        ":" +
        (second + 1 < 10 ? "0" + second : second);

      let result2 =
        year +
        "-" +
        (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
        "-" +
        (date + 1 < 10 ? "0" + date : date);

      let result = {
        hasTime: result1,
        withoutTime: result2
      };

      return result;
    },
    getcarlist() {
      var openId = "null";
      var params = {
        openId: this.oepnId
      };
      this.axios
        .post("/careful/car_list", params)
        .then(res => {
          console.log(res);
          this.list = res.data.data.list;
        })
        .catch(err => {
          console.error(err);
        });
    },
    onLoad() {
      // 异步更新数据
      this.loading = false;
      this.finished = true;
    },
    onClickLeft() {},
    onClickRight() {
      this.$router.push("addvehicle");
    }
  }
};
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
