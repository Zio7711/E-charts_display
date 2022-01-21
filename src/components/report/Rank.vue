<template>
  <div class="com-container">
    <div class="com-chart" ref="rankRef"></div>
  </div>
</template>

<script>
export default {
  name: "Rank",

  data() {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0,
      endValue: 9,
      timerId: null,
    };
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.rankRef,
        "purple-passion"
      );
      const initOption = {
        xAxis: {
          type: "category",
        },

        yAxis: {
          type: "value",
        },

        series: [
          {
            type: "bar",
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },

    async getData() {
      const res = await this.$http.get("rank");
      this.allData = res.data;
      this.updateChart();
    },

    updateChart() {
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      const provinceInfo = this.allData.map((item) => item.name);
      const valueArr = this.allData.map((item) => item.value);

      const dataOption = {
        xAxis: {
          data: provinceInfo,
        },

        series: [
          {
            data: valueArr,
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
