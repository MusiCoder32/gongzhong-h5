<template>
  <div>
    <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">预约钣喷，请填写车辆信息</van-notice-bar>
    <div>
      <van-panel title="标题" desc="描述信息" status="状态">
        <div class="keyboardCont">
          <keyboard ref="cropperImgFun" :boradArr="boradArr" :getboard="getboard"></keyboard>
        </div>
        <template #header>
          <div class="infotxt">
            <van-row type="flex" justify="space-between">
              <van-col span="16">车辆信息：</van-col>
              <van-col span="8">
                <div style="    text-align: right;">
                  <van-button size="small" @click="boardselectshow=true" type="primary">选择车辆</van-button>
                </div>
              </van-col>
            </van-row>
          </div>
        </template>
      </van-panel>
      <van-action-sheet v-model="boardselectshow" :actions="actions" @select="onSelect" />
    </div>

    <van-form @submit="onSubmit" label-align="left">
      <div class="form_module">
        <div>
          <van-field
            readonly
            clickable
            name="calendar"
            :value="boradform.appointmentTime"
            label="时间："
            placeholder="点击选择日期"
            @click="timesshowCalendar = true"
          />
          <van-calendar v-model="timesshowCalendar" @confirm="timesonConfirm" />
        </div>
      </div>
      <div class="upimg">
        <van-field name="uploader" label-width="100%" label="请上传需要钣喷的部位：">
          <template #input>
            <van-uploader :max-count="6" :after-read="upafter" v-model="uploader" />
          </template>
        </van-field>
      </div>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import keyboard from "../components/keyboard";
import { Toast } from "vant";
export default {
  components: {
    keyboard
  },
  data() {
    return {
      boardselectshow: false,
      boradArr: [],
      actions: [],
      timesshowCalendar: false,
      boradform: {
        size: "",
        accident: "",
        scale: "",
        appointmentTime: "",
        plateNumber: ""
      },
      boradparams: {
        size: "",
        accident: "",
        scale: "",
        appointmentTime: "",
        plateNumber: ""
      },
      uploader: [],
      
      oepnId: "",
    };
  },
  mounted() {
    this.getcarlist();
     var userinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (userinfo == null) {
      this.getopenID();
    } else {
      this.oepnId = userinfo.openid;
      console.log(userinfo);
    }
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
    getcarlist() {
      this.actions = [];
      var openId = "null";
      var params = {
        openId: this.oepnId
      };
      this.axios
        .post("/careful/car_list", params)
        .then(res => {
          console.log(res);
          var list = res.data.data.list;
          list.forEach((i, k) => {
            this.actions.push({
              name: i.models,
              subname: "车牌号：" + i.plateNumber,
              value: i.plateNumber
            });
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    upafter(file) {
      this.imgfile = file.file;
    },
    onSubmit(values) {
      var params = new FormData();
      params.append("appointmentTime", this.boradform.appointmentTime);
      params.append("file", this.imgfile);
      params.append("plateNumber", this.boradform.plateNumber);
      params.append("oepnId",  this.openid);
      this.axios
        .post("/about/lacquered_add", params)
        .then(res => {
          if (res.data.code !== 10000) {
            Toast.fail(res.data.msg + "请重新填s写错误信息");
          } else {
            Toast.success(res.data.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    onSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.boardselectshow = false;
      this.boradparams.plateNumber = item.value;
      this.boradArr = item.value.split("");
    },

    getboard(borad) {
      console.log(borad);
      this.boradform.plateNumber = borad.join("");
    },
    timesonConfirm(date) {
      var date = date;
      var m = date.getMonth() + 1;
      var d = date.getDate();
      if (m >= 1 && m <= 9) {
        m = "0" + m;
      }
      if (d >= 0 && d <= 9) {
        d = "0" + d;
      }
      var timer = date.getFullYear() + "-" + m + "-" + d;
      this.boradform.appointmentTime = timer;
      this.timesshowCalendar = false;
    }
  }
};
</script>
<style scoped>
.infotxt {
  height: 34px;
  line-height: 34px;
  text-align: left;
  padding: 9px 40px;
  font-size: 17px;
}

.keyboardCont {
  margin: 15px;
  padding-bottom: 15px;
}
.upimg .van-cell {
  flex-flow: column;
}
</style>
<style >
.upimg .van-field__label {
  display: block;
  height: 40px;
  line-height: 40px;
  margin: 10px 0;
}
</style>