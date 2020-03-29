<template>
  <div>
    <van-tabs v-model="activeName">
      <van-tab title="驾驶证扫描添加" name="a">
        <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">请在明亮区域拍取完整驾驶证并且上传</van-notice-bar>
        <div>
          <van-form @submit="onSubmit" label-align="left">
            <div class="upimg">
              <van-field name="uploader" label-width="100%" label="请上传需要驾驶证图片：">
                <template #input>
                  <van-uploader :max-count="1" :after-read="upafter" v-model="uploader" />
                </template>
              </van-field>
            </div>
          </van-form>
        </div>
      </van-tab>
      <van-tab title="填写资料添加" name="b">
        <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">请填写完整信息并且确定正确</van-notice-bar>

        <div>
          <van-panel title="标题" desc="描述信息" status="状态">
            <div class="keyboardCont">
              <keyboard ref="cropperImgFun" :boradArr="boradArr" :getboard="getboard"></keyboard>
            </div>
            <template #header>
              <div class="infotxt">
                <van-row type="flex" justify="space-between">
                  <van-col span="16">车牌号：</van-col>
                </van-row>
              </div>
            </template>
          </van-panel>
        </div>

        <van-form @submit="onsetSubmit" label-align="left">
          <!-- <div>
            <van-field readonly
                       clickable
                       name="picker"
                       :value="boradform.registTime"
                       label="车辆品牌"
                       placeholder="选择车辆品牌"
                       @click="maintenanceshowCalendar = true" />
            <van-popup v-model="maintenanceshowCalendar"
                       position="bottom">
              <van-picker show-toolbar
                          :columns="maintenancecolumns"
                          @confirm="maintenanceonConfirm"
                          @cancel="maintenanceshowCalendar = false" />
            </van-popup>
          </div>-->
          <div>
            <van-field
              v-model="boradform.models"
              name="品牌名称"
              label="品牌名称"
              placeholder="品牌名称"
              :rules="[{ required: true, message: '请填写品牌名称' }]"
            />
          </div>
          <div>
            <van-field
              v-model="boradform.frameNumber"
              name="车架号"
              label="车架号"
              placeholder="车架号"
              :rules="[{ required: true, message: '请填写车架号' }]"
            />
          </div>
          <div class="form_module">
            <div>
              <van-field
                readonly
                clickable
                name="calendar"
                :value="boradform.registTime"
                label="注册时间"
                placeholder="点击选择日期"
                @click="timesshowCalendar = true"
              />
              <!-- <van-datetime-picker v-model="currentDate"

              type="date" />-->
              <van-popup v-model="timesshowCalendar" position="bottom">
                <!-- 开始时间 -->
                <van-datetime-picker
                  @confirm="timesonConfirm"
                  :min-date="minDate"
                  type="date"
                  v-model="registTime"
                />
              </van-popup>
            </div>
          </div>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </van-tab>
    </van-tabs>
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
      username: "",
      maintenancecolumns: ["奥迪Q7", "宝马X3", "宝骏530"],
      boardselectshow: false,
      boradArr: [],
      actions: [
        { name: "奥迪Q7", subname: "车牌号：川A497979" },
        { name: "宝马X3", subname: "车牌号：川A497979" },
        { name: "宝骏530", subname: "车牌号：川A497979" }
      ],
      timesshowCalendar: false,
      maintenanceshowCalendar: false,
      boradform: {
        frameNumber: "LS5W3ABE39B059025",
        models: "长安",
        plateNumber: "川A78YY4",
        registTime: ""
      },
      boradparams: {
        frameNumber: "LS5W3ABE39B059025",
        models: "长安",
        plateNumber: "川A78YY4",
        registTime: ""
      },
      registTime: new Date(),
      activeName: "a",
      uploader: [],
      file: "",
      minDate: new Date(1996, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      imgfile: "",
      oepnId:""
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
    upafter(file) {
      file.message = "上传中...";
      file.status = "uploading";
      var params = new FormData();
      params.append("file", file.file);
      this.file = file.file;
      this.axios
        .post("/personal/car_add_one", params)
        .then(res => {
          if (res.data.code !== 10000) {
            Toast.fail(res.data.msg + "请重新上传");

            file.status = "failed";
            file.message = "上传失败";
          } else {
            Toast.success(res.data.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    maintenanceonConfirm(value) {
      this.boradform.frameNumber = value;
      this.boradparams.frameNumber = value;
      this.maintenanceshowCalendar = false;
    },
    onSubmit(values) {
      console.log("submit", values);
      console.log(this.boradparams);
    },
    onsetSubmit(values) {
       this.boradparams.oepnId = this.openid;
      this.axios
        .post("/personal/car_add_two", this.boradparams)
        .then(res => {
          if (res.data.code !== 10000) {
            Toast.fail(res.data.msg + "请重新填写错误信息");
          } else {
            Toast.fail(res.data.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    onClickLeft() {
      this.$router.go(-1); // 返回上一层
    },
    getboard(borad) {
      this.boradform.plateNumber = borad;
      this.boradparams.plateNumber = borad.join("");
    },

    timesonConfirm(times) {
      var date = times;
      var timestamp = new Date(date).getTime();
      console.log(timestamp);
      var m = date.getMonth() + 1;
      var d = date.getDate();
      if (m >= 1 && m <= 9) {
        m = "0" + m;
      }
      if (d >= 0 && d <= 9) {
        d = "0" + d;
      }
      var timer = date.getFullYear() + "-" + m + "-" + d;
      this.boradform.registTime = timer;
      this.boradparams.registTime = timestamp / 1000;
      this.timesshowCalendar = false;
    }
  }
};
</script>
<style  scoped>
.upimg .van-cell {
  flex-flow: column;
}

.keyboardCont {
  margin: 15px;
  padding-bottom: 15px;
}

.infotxt {
  height: 34px;
  line-height: 34px;
  text-align: left;
  padding: 9px 40px;
  font-size: 17px;
}
</style>
<style >
.upimg .van-field__label {
  display: block;
  height: 40px;
  line-height: 40px;
  margin: 0 0 10px 0;
}
</style>
