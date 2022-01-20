<template>
  <div class="com-container">
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
import chinaMap from "../../../public/map/china.json";
export default {
  name: "Map",

  data() {
    return {
      chartInstance: null,
      allData: null,
      showMenu: false,
    };
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.trendRef,
        "purple-passion"
      );
      this.$echarts.registerMap("china", chinaMap);
      const initOption = {
        title: {
          text: "▎商家分布",
          left: 20,
          top: 20,
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "-30%",
          roam: true,

          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333",
          },
        },
      };
      this.chartInstance.setOption(initOption);
    },

    async getData() {
      const { data: res } = await this.$http.get("map");
      this.allData = res;

      this.updateChart();
    },

    updateChart() {
      const legendArr = this.allData.map((item) => {
        return item.name;
      });
      const seriesArr = this.allData.map((item) => {
        return {
          type: "effectScatter",
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
          rippleEffect: {
            scale: 10,
            brushType: "stroke",
          },
        };
      });
      const dataOption = {
        legend: {
          left: "2%",
          bottom: "5%",
          orient: "vertical",
          data: legendArr.reverse(),
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      const adapterOption = {};
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },

  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },

  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
};
</script>

<style></style>
