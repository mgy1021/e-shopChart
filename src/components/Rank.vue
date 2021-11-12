<!--
 * @Description: 
 * @Author: Mogy
 * @Date: 2021-11-09 23:37:34
 * @LastEditors: Mogy
 * @LastEditTime: 2021-11-11 14:45:05
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref">rank组件</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0,  //区域缩放的起点值
      endValue: 9,     //区域缩放的终点值
      timerId: null,
    };
  },
  computed: {
    ...mapState(['theme'])
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
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
      const initOption = {
        title: {
          text: "▎地区销售排行",
          left: 20,
          top: 20
        },
        tooltip: {
          show: true
        },
        grid: {
          top: "30%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value"
        },
        series: [{
          type: "bar",
        }]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    getData (res) {
      //   const { data: res } = await this.$http.get("/rank")
      this.allData = res
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5'],
      ]
      const provinceArr = this.allData.map(item => {
        return item.name
      })
      const valueArr = this.allData.map(item => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: provinceArr
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [{
          data: valueArr,
          itemStyle: {
            color: (arg) => {
              let targetColorArr = null
              if (arg.value > 300) {
                targetColorArr = colorArr[0]
              }
              else if (arg.value > 200) {
                targetColorArr = colorArr[1]
              } else {
                targetColorArr = colorArr[2]
              }
              return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: targetColorArr[0] }, { offset: 1, color: targetColorArr[1] }])
            }
          }
        }]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 2000)
    }
  },
  created () {
    //  在组件创建完成之后 进行回调函数的注册 
    this.$socket.registerCallBack("rankData", this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: "getData",
      socketType: 'rankData',
      chartName: "rank",
      value: ""
    })
    window.addEventListener("resize", this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener("resize", this.screenAdapter)
    clearInterval(this.timerId)
    // 在组件创建完成之后 进行回调函数的取消
    this.$socket.unRegisterCallBack("rankData")
  }
};
</script>
<style scoped>
</style>
