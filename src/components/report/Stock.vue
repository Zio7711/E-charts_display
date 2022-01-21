<template>
  <div class="com-container">
    <div class="com-chart" ref="stockRef"></div>
  </div>
</template>

<script>
export default {
  name: "Stock",

  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 1,
      timerId: null,
      centerArr: [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ],
      colorArr: [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55445"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"],
      ],
    };
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.stockRef,
        "purple-passion"
      );
      const initOption = {
        title: {
          text: "▎库存和销量分析",
          left: 20,
          top: "5%",
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },

    async getData() {
      const { data: res } = await this.$http.get("stock");
      this.allData = res;

      this.updateChart();
      this.startInterval();
    },

    updateChart() {
      const start = (this.currentIndex - 1) * 5;
      const end = start + 5;
      const showData = this.allData.slice(start, end);

      let seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          hoverAnimation: false,
          labelLine: {
            show: false,
          },
          radius: [110, 100],
          center: this.centerArr[index],
          label: { position: "center", color: this.colorArr[index][0] },
          data: [
            {
              name: item.name + "\n\n" + item.sales,
              value: item.sales,

              itemStyle: {
                // 创建线性渐变的颜色 从下往上
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  // 0%
                  { offset: 0, color: this.colorArr[index][0] },
                  // 100%
                  { offset: 1, color: this.colorArr[index][1] },
                ]),
              },

              tooltip: {
                formatter: `${item.name} <br/>销量: {c} <br/>占比: {d}%`,
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#bbb",
              },

              tooltip: {
                formatter: `${item.name} <br/>库存: {c} <br>占: {d}%`,
              },
            },
          ],
        };
      });

      const dataOption = {
        series: seriesArr,
      };

      this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      const adapterOption = {};
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },

    startInterval() {
      this.timerId && clearInterval(this.timerId);
      this.timerId = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > 2) this.currentIndex = 1;
        this.updateChart();
      }, 5000);
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
    clearInterval(this.timerId);
  },
};
</script>

<style></style>
