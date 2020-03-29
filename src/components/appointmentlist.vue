<template>
  <div>
    <div class="listCont">
      <van-list v-model="loading"
                :finished="finished"
                @load="onLoad">
        <van-card title="预约钣喷"
                  :thumb="gridImg.icon3">
          <template #desc>
            <p class="van-multi-ellipsis--l3 cardDesc">
              钣金喷漆是一种汽车修复技术，就是把将汽车金属外壳变形部分进行修复，比如车体外壳被撞了个坑，就可以通过钣金使之恢复原样，然后再通过喷涂专用油漆，使变形的汽车金属表面恢复到与其他完好的地方一样，光亮如初
            </p>
          </template>
          <template #footer>
            <van-button @click="$router.push('CoinSpray')">预约</van-button>
          </template>
        </van-card>
        <van-card title="维修预约"
                  :thumb="gridImg.icon1">
          <template #desc>
            <p class="van-multi-ellipsis--l3 cardDesc">
              对出现故障的汽车通过技术手段排查，找出故障原因，并采取一定措施使其排除故障并恢复达到一定的性能和安全标准
            </p>
          </template>
          <template #footer>
            <van-button @click="$router.push('maintenance')">预约</van-button>
          </template>
        </van-card>
        <van-card title="养护预约"
                  :thumb="gridImg.icon2">
          <template #desc>
            <p class="van-multi-ellipsis--l3 cardDesc">
              根据车辆各部位不同材料所需的保养条件，采用不同性质的专用护理材料和产品，对汽车进行全新的保养护理的工艺过程。现今的汽车养护含盖发动机、变速箱、底盘、冷却系统、燃油系统等的养护范围
            </p>
          </template>
          <template #footer>
            <van-button @click="$router.push('maintain')">预约</van-button>
          </template>
        </van-card>

      </van-list>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      finished: false,
      gridImg: {
        icon1: require("../assets/img/icon (1).png"),
        icon2: require("../assets/img/icon (2).png"),
        icon3: require("../assets/img/icon (3).png"),
      }
    }
  },
  methods: {
    routerto () {
      this.$router.push('')
    },
    onLoad () {
      // 异步更新数据
      this.loading = false;
      this.finished = true;
    },

  },
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
  margin: 7px 0px;
}
</style>