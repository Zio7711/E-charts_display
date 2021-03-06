<template>
  <div class="com-container">
    <div class="com-chart" ref="rankRef"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";

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

  computed: {
    ...mapState(["theme"]),
  },
  watch: {
    theme() {
      this.chartInstance.dispose();
      this.initChart();
      this.updateChart();
      this.screenAdapter();
    },
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rankRef, this.theme);
      const initOption = {
        title: {
          text: "▎地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "30%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },

        tooltip: {
          show: true,
        },

        xAxis: {
          type: "category",
        },

        yAxis: {
          type: "value",
        },

        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "top",
              color: "white",
              rotate: 30,
            },
          },
        ],
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
      // const res = await this.$http.get("rank");
      const res = await this.$http.get("rank.json");
      this.allData = res.data;
      this.allData.sort((a, b) => b.value - a.value);
      this.updateChart();
      this.startInterval();
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

        dataZoom: {
          // 区域缩放组件
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },

        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null;

                if (arg.value > 300) {
                  targetColorArr = colorArr[0];
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1];
                } else {
                  targetColorArr = colorArr[2];
                }

                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: targetColorArr[0] },
                  { offset: 1, color: targetColorArr[1] },
                ]);
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      const titleFontSize = (this.$refs.rankRef.offsetWidth / 100) * 3.6;

      const adapterOption = {
        title: {
          top: "5%",
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },

    startInterval() {
      this.timerId && clearInterval(this.timerId);

      this.timerId = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updateChart();
      }, 2000);
    },
  },

  created() {
    // this.$socket.registerCallBack("rankData", this.getData);
  },

  mounted() {
    this.initChart();
    this.getData();
    // this.$socket.send({
    //   action: "getData",
    //   socketType: "rankData",
    //   chartName: "rank",
    //   value: "",
    // });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },

  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    // this.$socket.unRegisterCallBack("rankData");
    clearInterval(this.timerId);
  },
};
</script>

<style></style>
