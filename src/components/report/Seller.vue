<template>
  <div class="com-container">
    <div class="com-chart" ref="sellerRef">Seller</div>
  </div>
</template>

<script>
export default {
  name: "Seller",
  data() {
    return {
      chartInstance: null,
      allData: null,
    };
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef);
    },

    async getData() {
      const { data: ret } = await this.$http.get("seller");
      this.allData = ret;
      this.updateChart();
    },

    updateChart() {
      // y轴上的数据
      const sellerNames = this.allData.map((item) => item.name);
      // x 轴上的数据
      const sellerValues = this.allData.map((item) => item.value);

      // 当拿到数据后，准备数据的配置项
      const dataOption = {
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: sellerNames,
        },
        series: [
          {
            type: "bar",
            data: sellerValues,
          },
        ],
      };

      // 设置数据
      this.chartInstance.setOption(dataOption);
    },
  },

  mounted() {
    this.initChart();
    this.getData();
  },
};
</script>

<style lang="less" scoped></style>
