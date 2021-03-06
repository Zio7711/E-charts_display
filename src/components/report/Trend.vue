<template>
  <div class="com-container">
    <div class="title" @click="showMenu = !showMenu" :style="comStyle">
      <div class="title-container">
        <span class="before-icon">▎ </span>
        <span>{{ showTitle }}</span>
        <span class="iconfont title-icon" :style="comStyle">&#xe6eb;</span>
      </div>

      <div class="select-con" v-show="showMenu">
        <div
          class="select-item"
          v-show="showMenu"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getThemeValue } from "../../utils/theme_utils";
export default {
  name: "Trend",

  data() {
    return {
      chartInstance: null,
      allData: null,
      showMenu: false,
      activeName: "map",
      titleFontSize: 0,
      value: "",
    };
  },

  computed: {
    ...mapState(["theme"]),

    selectTypes() {
      return this.allData
        ? this.allData.type.filter((item) => item.key !== this.activeName)
        : [];
    },

    showTitle() {
      return this.allData ? this.allData[this.activeName].title : "";
    },

    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        paddingLeft: this.titleFontSize / 3 + "px",
        color: getThemeValue(this.theme).titleColor,
      };
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

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trendRef, this.theme);
      const initOption = {
        grid: {
          left: "3%",
          top: "35%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        tooltip: {
          // 当鼠标移入坐标轴的显示提示
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },

        legend: {
          right: "5%",
          top: "18%",
          icon: "circle",
        },
      };
      this.chartInstance.setOption(initOption);
    },

    async getData() {
      // const { data: res } = await this.$http.get("trend");
      const { data: res } = await this.$http.get("trend.json");

      this.allData = res;

      this.updateChart();
    },

    updateChart() {
      // 半透明的颜色值
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];
      const timeArr = this.allData.common.month;
      const valueArr = this.allData[this.activeName].data;
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: this.activeName,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });

      //legend data
      const legendArr = valueArr.map((item) => {
        return item.name;
      });

      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        series: seriesArr,
        legend: {
          data: legendArr,
        },
      };
      this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      this.titleFontSize = (this.$refs.trendRef.offsetWidth / 100) * 3.6;
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          // 间距
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },

    handleSelect(key) {
      this.activeName = key;
      this.updateChart();
    },
  },

  created() {
    // this.$socket.registerCallBack("trendData", this.getData);
  },

  mounted() {
    this.initChart();
    this.getData();
    // this.$socket.send({
    //   action: "getData",
    //   socketType: "trendData",
    //   chartName: "trend",
    //   value: "",
    // });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },

  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    // this.$socket.unRegisterCallBack("trendData");
  },
};
</script>

<style lang="less">
.title {
  position: absolute;
  left: 50px;
  top: 20px;
  z-index: 999;
  color: white;
  cursor: pointer;

  .before-icon {
    position: absolute;
    left: -20px;
  }
  .title-icon {
    margin-left: 10px;
    transform: rotate(0deg);
  }

  .title-container {
    display: flex;
    align-items: center;
  }
}
</style>
