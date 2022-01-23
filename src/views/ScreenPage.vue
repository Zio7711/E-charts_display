<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <!-- <img :src="headerSrc" alt=""> -->
      </div>

      <span class="title" :style="titleStyle"
        >Real Time Data Display Chart</span
      >
      <div class="title-right">
        <!-- <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme" alt="切换主题" title="切换主题"> -->
        <img
          src="~@/assets/images/qiehuan_dark.png"
          class="qiehuan"
          @click="handleChangeTheme"
          alt="切换主题"
          title="切换主题"
          v-show="theme === 'purple-passion'"
        />
        <img
          src="~@/assets/images/qiehuan_light.png"
          class="qiehuan"
          @click="handleChangeTheme"
          alt="切换主题"
          title="切换主题"
          v-show="theme === 'vintage'"
        />
        <div class="datetime">{{ systemDateTime }}</div>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="{ fullscreen: fullScreenStatus.trend }">
          <!-- 销量趋势图表 -->
          <trend ref="trend"></trend>
          <div class="resize">
            <!-- icon-compress-alt 向内 -->
            <span
              @click="changeSize('trend')"
              :class="[
                'iconfont',
                fullScreenStatus.trend
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div id="left-bottom" :class="{ fullscreen: fullScreenStatus.seller }">
          <!-- 商家销售金额图表 -->
          <seller ref="seller"></seller>
          <div class="resize">
            <span
              @click="changeSize('seller')"
              :class="[
                'iconfont',
                fullScreenStatus.seller
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="{ fullscreen: fullScreenStatus.map }">
          <!-- 商家分布图表 -->
          <single-map ref="map"></single-map>
          <div class="resize">
            <span
              @click="changeSize('map')"
              :class="[
                'iconfont',
                fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div id="middle-bottom" :class="{ fullscreen: fullScreenStatus.rank }">
          <!-- 地区销量排行图表 -->
          <rank ref="rank"></rank>
          <div class="resize">
            <span
              @click="changeSize('rank')"
              :class="[
                'iconfont',
                fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="{ fullscreen: fullScreenStatus.hot }">
          <!-- 热销商品占比图表 -->
          <hot ref="hot"></hot>
          <div class="resize">
            <span
              @click="changeSize('hot')"
              :class="[
                'iconfont',
                fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div id="right-bottom" :class="{ fullscreen: fullScreenStatus.stock }">
          <!-- 库存销量分析图表 -->
          <stock ref="stock"></stock>
          <div class="resize">
            <span
              @click="changeSize('stock')"
              :class="[
                'iconfont',
                fullScreenStatus.stock
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from "@/components/report/Hot.vue";
import Map from "@/components/report/Map.vue";
import Rank from "@/components/report/Rank.vue";
import Seller from "@/components/report/Seller.vue";
import Stock from "@/components/report/Stock.vue";
import Trend from "@/components/report/Trend.vue";
import { getThemeValue } from "../utils/theme_utils";

import { mapState } from "vuex";

// 导入自己定义的主题工具函数 用于返回不同主题下的配置对象

export default {
  name: "ScreenPage",
  components: {
    Hot,
    "single-map": Map,
    Rank,
    Seller,
    Stock,
    Trend,
  },
  data() {
    return {
      // 各组件是否全屏状态
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false,
      },
      // 当前的系统时间
      systemDateTime: null,
      // 用于保存当前系统日期的定时器id
      timerID: null,
    };
  },

  computed: {
    ...mapState(["theme"]),

    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor,
      };
    },

    titleStyle() {
      return {
        color: getThemeValue(this.theme).titleColor,
      };
    },
  },

  methods: {
    changeSize(chartName) {
      this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName];
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter();
      });

      // const targetValue = !this.fullScreenStatus[chartName];
      // this.$socket.send({
      //   action: "fullScreen",
      //   socketType: "fullScreen",
      //   chartName: chartName,
      //   value: targetValue,
      // });
    },

    recvData(data) {
      // 取出是那一个图表进行切换
      const chartName = data.chartName;
      // 判断切换成什么类型[true全屏，false取消全屏]
      const targetValue = data.value;

      this.fullScreenStatus[chartName] = targetValue;
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter();
      });
    },

    handleChangeTheme() {
      this.$store.commit("CHANGETHEME");
      // this.$socket.send({
      //   action: "themeChange",
      //   socketType: "themeChange",
      //   chartName: "",
      //   value: "",
      // });
    },

    recvThemeChange() {
      this.$store.commit("CHANGETHEME");
    },

    currentTime() {
      this.systemDateTime = new Date().toLocaleString();

      this.timerID && clearInterval(this.timerID);

      this.timerID = setInterval(() => {
        this.systemDateTime = new Date().toLocaleString();
      }, 1000);
    },
  },

  created() {
    this.currentTime();
    // this.$socket.registerCallBack("fullScreen", this.recvData);
    // this.$socket.registerCallBack("themeChange", this.recvThemeChange);
  },

  destroyed() {
    // 组件销毁时，销毁事件
    // this.$socket.unRegisterCallBack("fullScreen");
    // this.$socket.unRegisterCallBack("themeChange");
    clearInterval(this.timerID);
  },
};
</script>
<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 9999;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 100px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 50px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 23px;
    cursor: pointer;
  }
  .datetime {
    font-size: 25px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    a {
      text-decoration: none;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;

  cursor: pointer;
  .iconfont {
    font-size: 22px;
  }
}

@media (min-width: 320px) and (max-width: 760px) {
  .screen-container {
    overflow: auto;
  }
  .screen-body {
    display: flex;
    flex-direction: column;
    height: fit-content;
    .screen-left {
      width: 100%;
      #left-top {
        height: 400px;
      }

      #left-bottom {
        height: 400px;
      }
    }

    .screen-middle {
      width: 100%;
      margin: 0;
      margin-top: 25px;
      margin-bottom: 25px;
      #middle-top {
        height: 400px;
      }

      #middle-bottom {
        height: 400px;
      }
    }

    .screen-right {
      width: 100%;

      #right-top {
        height: 400px;
      }

      #right-bottom {
        height: 400px;
      }
    }
  }
}
</style>
