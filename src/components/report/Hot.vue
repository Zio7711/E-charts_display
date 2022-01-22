<template>
  <div class="com-container">
    <div class="com-chart" ref="hotRef"></div>
    <i class="iconfont icon-left" @click="toLeft" :style="comStyle">&#xe6ef;</i>
    <i class="iconfont icon-right" @click="toRight" :style="comStyle"
      >&#xe6ed;</i
    >
    <span class="cate-name" :style="comStyle">{{ cateName }}</span>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import { getThemeValue } from "../../utils/theme_utils";
export default {
  name: "Hot",

  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: null,
    };
  },

  computed: {
    cateName() {
      if (!this.allData) return "";
      return this.allData[this.currentIndex].name;
    },

    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getThemeValue(this.theme).titleColor,
      };
    },

    ...mapState(["theme"]),
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hotRef, this.theme);
      const initOption = {
        title: {
          text: "▎热销商品占比",
          left: 20,
          top: "5%",
        },

        legend: {
          top: "15%",
          icon: "circle",
        },

        tooltip: {
          show: true,
          formatter: (arg) => {
            const thirdCategory = arg.data.children;
            let total = 0;
            thirdCategory.forEach((item) => {
              total += item.value;
            });

            let showStr = "";
            thirdCategory.forEach((item) => {
              showStr += `
                ${item.name}: ${_.round((item.value / total) * 100, 2)}% <br/>
              `;
            });

            return showStr;
          },
        },

        series: [
          {
            type: "pie",
            label: {
              show: false,
            },
            legend: {
              top: "15%",
              icon: "circle",
            },
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },

    getData(res) {
      // const { data: res } = await this.$http.get("/hotproduct");

      this.allData = res;
      this.updateChart();
    },

    updateChart() {
      const legendDataArr = this.allData[this.currentIndex].children.map(
        (item) => item.name
      );
      const seriesDataArr = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          };
        }
      );

      const dataOption = {
        legend: {
          data: legendDataArr,
        },
        series: [
          {
            data: seriesDataArr,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      this.titleFontSize = (this.$refs.hotRef.offsetWidth / 100) * 3.6;

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },

        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ["50%", "60%"],
          },
        ],
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },

    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) this.currentIndex = this.allData.length - 1;
      this.updateChart();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) this.currentIndex = 0;
      this.updateChart();
    },
  },

  watch: {
    theme() {
      this.chartInstance.dispose();
      this.initChart();
      this.updateChart();
      this.screenAdapter();
    },
  },

  created() {
    this.$socket.registerCallBack("hotData", this.getData);
  },

  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "hotData",
      chartName: "hotproduct",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },

  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegisterCallBack("hotData");
  },
};
</script>

<style lang="less" scoped>
.com-container {
  color: white;

  i {
    z-index: 999;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    cursor: pointer;
  }
  i.icon-left {
    left: 10%;
  }
  i.icon-right {
    right: 10%;
  }
  .cate-name {
    position: absolute;
    right: 10%;
    bottom: 20px;
    z-index: 999;
  }
}
</style>
