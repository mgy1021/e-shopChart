<!--
 * @Description: 
 * @Author: Mogy
 * @Date: 2021-11-10 10:26:25
 * @LastEditors: Mogy
 * @LastEditTime: 2021-11-11 14:45:41
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle"
      >&#xe6ef;</span
    >
    <span class="iconfont arr-right" @click="toRight" :style="comStyle"
      >&#xe6ed;</span
    >
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<script>
import { getThemeValue } from "@/utils/theme_utils"
import { mapState } from 'vuex'

export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,  //当前所展示出的一级分类数据
      titleFontSize: 0
    };
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      const initOption = {
        title: {
          text: "▎热销商品的占比",
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach(item => {
              retStr += `${item.name}:${parseInt(item.value / total * 100) + '%'}</br>`
            })
            return retStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              //   labelLine: {
              //     show: false
              //   }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    getData (res) {
      //   const { data: res } = await this.$http.get('/hotproduct')
      this.allData = res
      this.updateChart()
    },
    updateChart () {
      const legendData = this.allData[this.currentIndex].children.map((item) => {
        return item.name
      })
      const seriesData = this.allData[this.currentIndex].children.map((item) => {
        return { name: item.name, value: item.value, children: item.children }
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ],
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    }
  },
  computed: {
    catName () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
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
  created () {
    //  在组件创建完成之后 进行回调函数的注册 
    this.$socket.registerCallBack("hotproductData", this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: "getData",
      socketType: 'hotproductData',
      chartName: "hotproduct",
      value: ""
    })
    window.addEventListener("resize", this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener("resize", this.screenAdapter)
    // 在组件创建完成之后 进行回调函数的取消
    this.$socket.unRegisterCallBack("hotproductData")
  }
};
</script>
<style scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 60%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 60%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>