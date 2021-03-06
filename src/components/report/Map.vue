<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="mapRef"></div>
  </div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo } from "../../utils/map_utils";
import { mapState } from "vuex";

export default {
  name: "Map",

  data() {
    return {
      chartInstance: null,
      allData: null,
      mapData: {},
    };
  },
  computed: {
    ...mapState(["theme"]),
  },

  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.mapRef, this.theme);

      // const res = await this.$http.get(`/map/china`);
      const res = await axios.get(
        "https://e-charts-display.vercel.app/map/china.json"
      );
      this.$echarts.registerMap("china", res.data);

      const initOption = {
        title: {
          text: "▎商家分布",
          left: 20,
          top: "5%",
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333",
          },
        },

        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("click", async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name);

        if (provinceInfo.key) {
          if (!this.mapData[provinceInfo.key]) {
            const res = await axios.get(
              "https://e-charts-display.vercel.app/" + provinceInfo.path
            );

            // const res = await this.$http.get(`/${provinceInfo.path}`);

            this.mapData[provinceInfo.key] = res.data;
            this.$echarts.registerMap(provinceInfo.key, res.data);
          }

          const changeOption = {
            geo: {
              map: provinceInfo.key,
            },
          };

          this.chartInstance.setOption(changeOption);
        }
      });
    },

    async getData() {
      // const { data: res } = await this.$http.get("map");
      const { data: res } = await this.$http.get("map.json");
      // const { data: res } = await axios.get("http://localhost:8080/map.json");

      this.allData = res;

      this.updateChart();
    },

    updateChart() {
      const legendArr = this.allData.map((item) => {
        return item.name;
      });
      const seriesArr = this.allData.map((item) => {
        return {
          type: "effectScatter",
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
          rippleEffect: {
            scale: 10,
            // brushType: "stroke",
          },
        };
      });
      const dataOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      const titleFontSize = (this.$refs.mapRef.offsetWidth / 100) * 3.6;

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },

    revertMap() {
      const revertOption = {
        geo: {
          map: "china",
        },
      };

      this.chartInstance.setOption(revertOption);
    },
  },
  watch: {
    theme() {
      this.chartInstance.dispose();
      this.initChart();
      this.updateChart();
      this.screenAdapter();
    },
  },

  created() {
    // this.$socket.registerCallBack("mapData", this.getData);
  },

  mounted() {
    this.initChart();
    this.getData();
    // this.$socket.send({
    //   action: "getData",
    //   socketType: "mapData",
    //   chartName: "map",
    //   value: "",
    // });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },

  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    // this.$socket.unRegisterCallBack("mapData");
  },
};
</script>

<style></style>
