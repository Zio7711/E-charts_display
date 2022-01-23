<template>
  <div class="com-container">
    <div class="com-chart" ref="sellerRef">Seller</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

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
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, this.theme);

      const initOption = {
        title: {
          text: "▎商家销售统计",
          left: 20,
          top: "5%",
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
        },

        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
          },
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },

            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#5052EE",
                },
                {
                  offset: 1,
                  color: "#AB6EE5",
                },
              ]),
            },
          },
        ],
      };

      this.chartInstance.setOption(initOption);

      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });

      this.chartInstance.on("mouseout", () => {
        this.startInterVal();
      });
    },

    async getData() {
      const { data: res } = await this.$http.get("seller");
      this.allData = res;

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
        yAxis: {
          data: sellerNames,
        },

        series: [
          {
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

    screenAdapter() {
      const titleFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6;

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },

  computed: {
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      this.chartInstance.dispose();
      this.initChart();
      this.screenAdapter();
      this.updateChart();
    },
  },
  created() {
    // this.$socket.registerCallBack("sellerData", this.getData);
  },
  mounted() {
    this.initChart();
    this.getData();
    // this.$socket.send({
    //   action: "getData",
    //   socketType: "sellerData",
    //   chartName: "seller",
    //   value: "",
    // });

    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },

  beforeDestroy() {
    // this.$socket.unRegisterCallBack("sellerData");
    clearInterval(this.timeId);
    window.removeEventListener("resize", this.screenAdapter);
  },
};
</script>

<style lang="less" scoped></style>
