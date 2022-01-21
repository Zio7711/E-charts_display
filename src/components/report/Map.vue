<template>
  <div class="com-container">
    <div class="com-chart" ref="mapRef"></div>
  </div>
</template>

<script>
import chinaMap from "../../../public/map/china.json";
import axios from "axios";

import { getProvinceMapInfo } from "../../utils/map_utils";
export default {
  name: "Map",

  data() {
    return {
      chartInstance: null,
      allData: null,
      showMenu: false,
    };
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.mapRef,
        "purple-passion"
      );
      this.$echarts.registerMap("china", chinaMap);
      const initOption = {
        title: {
          text: "▎商家分布",
          left: 20,
          top: 20,
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "10%",
          roam: true,

          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333",
          },
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("click", async (arg) => {
        const provinceInfo = getProvinceMapInfo(arg.name);
        const mapData = await axios.get(
          "http://localhost:8080" + provinceInfo.path
        );

        this.$echarts.registerMap(provinceInfo.key, mapData.data);
        const changeOption = {
          geo: {
            map: provinceInfo.key,
          },
        };

        this.chartInstance.setOption(changeOption);
      });
    },

    async getData() {
      const { data: res } = await this.$http.get("map");
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
          left: "2%",
          bottom: "5%",
          orient: "vertical",
          data: legendArr.reverse(),
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
