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
      currentPage: 1,
      totalPage: 0,
      timerId: null, // time interval
    };
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.sellerRef,
        "purple-passion"
      );

      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });

      this.chartInstance.on("mouseout", () => {
        this.startInterVal();
      });
    },

    async getData() {
      const { data: ret } = await this.$http.get("seller");
      this.allData = ret;

      //sort all data and separate them in to different page
      this.allData.sort((a, b) => b.value - a.value);
      this.totalPage = Math.ceil(this.allData.length / 5);

      this.updateChart();
      this.startInterVal();
    },

    updateChart() {
      //分页展示数据
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);

      const sellerNames = showData.map((item) => item.name);
      const sellerValues = showData.map((item) => item.value);

      const dataOption = {
        title: {
          text: "▎商家销售统计",
          left: 20,
          top: 20,
          textStyle: {
            fontSize: 50,
          },
        },

        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          // 默认grid不包含坐标轴文字，改为true
          containLabel: true,
        },
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

    startInterVal() {
      this.timerId && clearInterval(this.timerId);
      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) this.currentPage = 1;
        this.updateChart();
      }, 3000);
    },
  },

  mounted() {
    this.initChart();
    this.getData();
  },

  beforeDestroy() {
    clearInterval(this.timeId);
  },
};
</script>

<style lang="less" scoped></style>
