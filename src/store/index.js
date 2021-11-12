/*
 * @Description: 
 * @Author: Mogy
 * @Date: 2021-11-09 09:41:41
 * @LastEditors: Mogy
 * @LastEditTime: 2021-11-11 14:25:17
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        theme: 'chalk'
    },
    mutations: {
        changeTheme (state) {
            if (state.theme === 'chalk') {
                state.theme = 'vintage'
            } else {
                state.theme = 'chalk'
            }
        }
    },
    actions: {
    },
    modules: {
    }
})
