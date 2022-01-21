<template>
  <div class="com-container">
    <div class="com-chart" ref="hotRef"></div>
  </div>
</template>

<script>
export default {
  name: "Hot",

  data() {
    return {};
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.hotRef,
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
