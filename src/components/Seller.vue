<!--
 * @Description: 商家销量统计的横向柱状图
 * @Author: Mogy
 * @Date: 2021-11-09 10:19:03
 * @LastEditors: Mogy
 * @LastEditTime: 2021-11-11 14:54:39
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totlePage: 0,
      timerId: null //定时器的标识
    }
  },
  methods: {
    // 初始化echartInstance对象
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)
      //   对图表初始化配置的控制
      const initOption = {
        title: {
          text: "▎商家销售统计",
          left: 20,
          top: 20
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true // 距离包含坐标轴上的文字
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white"
              }
            },
            itemStyle: {
              //   指明颜色渐变的方向
              // 指明不同百分比之下颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: "#5052EE" }, { offset: 1, color: "#AB6EE5" }])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)

      //  对图表对象进行鼠标事件的监听
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on("mouseout", () => {
        this.startInterval()
      })
    },
    // 获取服务器的数据
    getData (res) {
      //   const { data: ret } = await this.$http.get("/seller")
      this.allData = res
      this.allData.sort((a, b) => {
        return a.value - b.value //从小到大
      })
      this.totlePage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updateCharts()
      //   启动定时器
      this.startInterval()
    },
    // 更新图表
    updateCharts () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValues = showData.map((item) => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues,
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totlePage) {
          this.currentPage = 1
        }
        this.updateCharts()
      }, 3000)
    },
    // 当浏览器的大小发生变化的时候，会调用的方法，来完成屏幕的适配
    screenAdapter () {
      //   console.log(this.$refs.seller_ref.offsetWidth);
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      //   与分辨率大小相关的配置项
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
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      //   手动调用图表对象的resize才能产生适配效果
      this.chartInstance.resize()
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      this.chartInstance.dispose() //销毁当前图表
      this.initChart() //重新以最新的主题名称初始化图表对象
      this.screenAdapter()
      this.updateCharts()
    }
  },
  created () {
    //  在组件创建完成之后 进行回调函数的注册 
    this.$socket.registerCallBack("sellerData", this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: "getData",
      socketType: 'sellerData',
      chartName: "seller",
      value: ""
    })
    window.addEventListener("resize", this.screenAdapter)
    // 在页面加载完毕后，进行屏幕的适配
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    window.removeEventListener("resize", this.screenAdapter)
    // 在组件创建完成之后 进行回调函数的取消
    this.$socket.unRegisterCallBack("sellerData")
  }
}
</script>
<style scoped>
</style>
