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
      const initOption = {};
      this.chartInstance.setOption(initOption);
    },

    async getData() {
      const { data: res } = await this.$http.get("/api/trend");
      this.allData = res;

      this.updateChart();
    },

    updateChart() {
      const dataOption = {};
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
