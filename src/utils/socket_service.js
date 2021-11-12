/*
 * @Description:
 * @Author: Mogy
 * @Date: 2021-11-10 16:34:31
 * @LastEditors: Mogy
 * @LastEditTime: 2021-11-11 15:40:35
 */

export default class SocketService {
    /*
        单例
    */
    static instance = null
    static get Instance () {
        if (!this.instance) {
            this.instance = new SocketService()
        }
        return this.instance
    }

    // 和服务端连接的socket对象
    ws = null

    // 标识是否连接成功了
    connected = false

    // 记录重试的次数
    sendRetryCount = 0

    // 重新连接尝试的次数
    connectRetryCount = 0

    // 存储回调函数
    callBackMapping = {}

    // 定义连接服务器的方法
    connect () {
        // 连接服务器
        if (!window.WebSocket) {
            return console.log("您的浏览器不支持WebSocket");
        }
        this.ws = new WebSocket('ws://8.133.167.153:9988')

        // 连接成功的事件
        this.ws.onopen = () => {
            // console.log("连接服务端成功了");
            this.connected = true
            // 重置重新连接的变量
            this.connectRetryCount = 0
        }
        // 1. 连接服务器失败
        // 2. 当连接成功之后，服务器关闭的情况
        this.ws.onclose = () => {
            console.log("连接服务端失败");
            this.connected = false
            this.connectRetryCount++
            setTimeout(() => {
                this.ws = new WebSocket('ws://8.133.167.153:9988')
            }, 500 * this.connectRetryCount)
        }
        this.ws.onmessage = msg => {
            // console.log(msg.data);
            const recvData = JSON.parse(msg.data)
            const socketType = recvData.socketType
            // 判断回调函数是否存在
            if (this.callBackMapping[socketType]) {
                const action = recvData.action
                if (action === 'getData') {
                    const realData = JSON.parse(recvData.data)
                    this.callBackMapping[socketType].call(this, realData)
                }
                else if (action === 'fullScreen') {
                    this.callBackMapping[socketType].call(this, recvData)
                }
                else if (action === 'themeChange') {
                    this.callBackMapping[socketType].call(this, recvData)
                }
            }
        }

    }
    // 回调函数的注册
    registerCallBack (socketType, callBack) {
        this.callBackMapping[socketType] = callBack
    }
    // 取消某一个回调函数
    unRegisterCallBack (socketType) {
        this.callBackMapping[socketType] = null
    }
    // 发送数据的方法
    send (data) {
        if (this.connected) {
            this.sendRetryCount = 0
            this.ws.send(JSON.stringify(data))
        } else {
            this.sendRetryCount++
            setTimeout(() => {
                this.ws.send(JSON.stringify(data))
            }, 500 * this.sendRetryCount)
        }
    }
}