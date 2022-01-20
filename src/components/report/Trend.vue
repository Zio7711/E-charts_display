<template>
  <div class="com-container">
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
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

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.trendRef,
        "purple-passion"
      );
      const initOption = {
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
      };
      this.chartInstance.setOption(initOption);
    },

    async getData() {
      const { data: res } = await this.$http.get("trend");
      this.allData = res;

      this.updateChart();
    },

    updateChart() {
      const timeArr = this.allData.common.month;
      const valueArr = this.allData.map.data;
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: "map",
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
