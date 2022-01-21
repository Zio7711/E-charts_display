<template>
  <div class="com-container">
    <div class="com-chart" ref="hotRef"></div>
  </div>
</template>

<script>
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

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.hotRef,
        "purple-passion"
      );
      const initOption = {
        series: [
          {
            type: "pie",
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },

    async getData() {
      const { data: res } = await this.$http.get("/hotproduct");
      this.allData = res;
      this.updateChart();
    },

    updateChart() {
      const legendDateArr = this.allData[this.currentIndex].children.map(
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
        series: [
          {
            data: seriesDataArr,
          },
        ],
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
