/*
 * @Description:
 * @Author: Mogy
 * @Date: 2021-11-11 11:52:20
 * @LastEditors: Mogy
 * @LastEditTime: 2021-11-11 15:06:44
 */
const theme = {
    chalk: {
        backgroundColor: '#161522',
        titleColor: '#ffffff',
        // 左上角logo的图标路径
        logoSrc: 'logo_dark.png',
        // 切换主题按钮的图片路径
        themeSrc: 'qiehuan_dark.png',
        // 页面顶部的边框图片
        headerBorderSrc: 'header_border_dark.png',
        selectBackgroundColor: "#222733"
    },
    vintage: {
        backgroundColor: '#eeeeee',
        titleColor: '#333333',
        // 左上角logo的图标路径
        logoSrc: 'logo_light2.png',
        // 切换主题按钮的图片路径
        themeSrc: 'qiehuan_light.png',
        // 页面顶部的边框图片
        headerBorderSrc: 'header_border_light.png',
        selectBackgroundColor: "#ffffff"
    }
}

export function getThemeValue (themeName) {
    return theme[themeName]
}