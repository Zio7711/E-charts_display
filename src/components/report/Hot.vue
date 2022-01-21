<template>
  <div class="com-container">
    <div class="com-chart" ref="hotRef"></div>
    <i class="iconfont icon-left" @click="toLeft">&#xe6ef;</i>
    <i class="iconfont icon-right" @click="toRight">&#xe6ed;</i>
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
      const adapterOption = {};
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

<style lang="less" scoped>
.com-container {
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
