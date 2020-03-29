<template>
  <div id="app">
    <router-view />
    <!-- <div class="footerNav">
      <van-grid :column-num="3">
        <van-grid-item to="/">
          <div style="text-align:center;">
            <div>
              <van-image width="2rem"
                         height="2rem"
                         :src="gridImg.icon3" />
            </div>
            <p> 代办年审</p>
          </div>
        </van-grid-item>
        <van-grid-item to="/appointmentlist">
          <div style="text-align:center;">
            <div>
              <van-image width="2rem"
                         height="2rem"
                         :src="gridImg.icon1" />
            </div>
            <p> 预约</p>
          </div>
        </van-grid-item>
        <van-grid-item to="/userinfo">
          <div style="text-align:center;">
            <div>
              <van-image width="2rem"
                         height="2rem"
                         :src="gridImg.icon2" />
            </div>
            <p> 个人中心</p>
          </div>
        </van-grid-item>
      </van-grid>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      gridImg: {
        icon1: require("./assets/img/navicon (1).png"),
        icon2: require("./assets/img/navicon (2).png"),
        icon3: require("./assets/img/navicon (3).png"),
      }
    }
  },
  methods: {

  },
  mounted () {
    this.$oepnID = "1"
  },
}
</script>

<style>
@import "./assets/css/style.css";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.footerNav {
  position: absolute;
  width: 100%;
  bottom: 0;
}
</style>
