<!--
 * @Description: 
 * @Author: Mogy
 * @Date: 2021-11-10 11:42:40
 * @LastEditors: Mogy
 * @LastEditTime: 2021-11-11 14:46:48
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref">zujian</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,  //当前显示的数据
      timerId: null,
      titleFontSize: 0
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
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      const initOption = {
        title: {
          text: "▎库存和销量分析",
          top: 20,
          left: 20,
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on("mouseout", () => {
        this.startInterval()
      })
    },
    getData (res) {
      //   const { data: res } = await this.$http.get("/stock")
      this.allData = res
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%'],
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF'],
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesData = showData.map((item, index) => {
        return {
          type: 'pie',
          //   radius: [110, 100],
          center: centerArr[index],
          hoverAnimation: false, //关闭鼠标移入饼图效果
          labelLine: {
            show: false //隐藏指示线
          },
          label: {
            position: "center",
            color: colorArr[index][0]
          },
          data: [
            {
              value: item.sales,
              name: item.name + '\n\n' + item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{ offset: 0, color: colorArr[index][0] }, { offset: 1, color: colorArr[index][1] }])
              }
            }, {
              value: item.stock,
              itemStyle: {
                color: "#333843"
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesData
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const innerRadius = titleFontSize * 2.8
      const outterRadius = innerRadius * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if (!this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart()
      }, 5000)
    }
  },
  created () {
    //  在组件创建完成之后 进行回调函数的注册 
    this.$socket.registerCallBack("stockData", this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: "getData",
      socketType: 'stockData',
      chartName: "stock",
      value: ""
    })
    window.addEventListener("resize", this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener("resize", this.screenAdapter)
    // 在组件创建完成之后 进行回调函数的取消
    this.$socket.unRegisterCallBack("stockData")
    clearInterval(this.timerId)
  }
};
</script>
<style scoped>
</style>
