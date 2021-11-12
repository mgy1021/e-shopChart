<!--
 * @Description: 
 * @Author: Mogy
 * @Date: 2021-11-09 14:57:48
 * @LastEditors: Mogy
 * @LastEditTime: 2021-11-11 17:03:29
-->
<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios"
import { getProvinceMapInfo } from "@/utils/map_utils"
import { mapState } from 'vuex'

export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      mapData: {} // 所获取的省份的地图矢量数据缓存
    };
  },
  computed: {
    ...mapState(["theme"])
  },
  watch: {
    theme () {
      this.chartInstance.dispose() //销毁当前图表
      this.initChart() //重新以最新的主题名称初始化图表对象
      this.screenAdapter()
      this.updateChart()
    }
  },
  methods: {
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      //  获取中国地图的矢量数据
      const res = await axios.get("http://8.133.167.153:80/e-shop/static/map/china.json")
      this.$echarts.registerMap("china", res.data)
      let initOption = {
        title: {
          text: "▎商家分布",
          left: 20,
          top: 20
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333"
          }
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical"
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on("click", async (arg) => {
        // arg.name 得到所点击的省份，这个省份是中文的
        const provinceInfo = getProvinceMapInfo(arg.name)
        if (!provinceInfo.key) {
          return
        }
        // 判断当前点击的这个省份的地图矢量数据在mapData中是否存在
        if (!this.mapData[provinceInfo.key]) {
          // 获取这个省份的地图矢量数据
          const { data: ret } = await axios.get("http://8.133.167.153:80/e-shop" + provinceInfo.path)
          this.mapData[provinceInfo.key] = ret
          this.$echarts.registerMap(provinceInfo.key, ret)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    getData (res) {
      //   const { data: res } = await this.$http.get('/map')
      this.allData = res
      this.updateChart()
    },
    updateChart () {
      // 处理图表的数据
      // 图例的数据
      const legendArr = this.allData.map((item) => {
        return item.name
      })
      const seriesArr = this.allData.map((item) => {
        //return的这个对象就代表的是一个类别下的所有散点数据
        // 如果想在地图中显示散点的数据，所以我们需要给散点的图表增加一个配置,coordinateSystem
        return {
          type: "effectScatter",
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
          rippleEffect: {
            scale: 5,
            brushType: "stroke"
          }
        }
      })
      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      let adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    revertMap () {
      // 回到中国地图
      const revertOption = {
        geo: {
          map: "china"
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  },
  created () {
    //  在组件创建完成之后 进行回调函数的注册 
    this.$socket.registerCallBack("mapData", this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: "getData",
      socketType: 'mapData',
      chartName: "map",
      value: ""
    })
    window.addEventListener("resize", this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener("resize", this.screenAdapter)
    // 在组件创建完成之后 进行回调函数的取消
    this.$socket.unRegisterCallBack("mapData")
  }
};
</script>
<style scoped>
</style>
