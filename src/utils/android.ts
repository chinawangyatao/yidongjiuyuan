// 调用安卓地图
export function androidMap(poiname: String, position: String) {
  const lat = position.split(',')[1]
  const lng = position.split(',')[0]
  // 判断是否为安卓终端设备
  // if (customBrowserVersion().android)
  //   window.location.href = `androidamap://viewMap?sourceApplication=appname&poiname=${poiname}&lat=${lat}&lon=${lng}&dev=0`
  // // 判断是否为ios终端设备
  // else if (customBrowserVersion().ios)
  //   window.location.href = `iosamap://viewMap?sourceApplication=appname&poiname=${poiname}&lat=${lat}&lon=${lng}&dev=0`
  // // 如果为浏览器，直接使用浏览器高德地图
  // else
    window.location.href = `https://uri.amap.com/marker?position=${lng},${lat}$name=${poiname}`
}

export function customBrowserVersion() {
  const u = navigator.userAgent
  return {
    trident: u.includes('Trident'), // IE内核
    presto: u.includes('Presto'), // opera内核
    webKit: u.includes('AppleWebKit'), // 苹果、谷歌内核
    gecko: u.includes('Gecko') && !u.includes('KHTML'), // 火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: u.includes('Android') || u.includes('Adr'), // android终端
    iPhone: u.includes('iPhone'), // 是否为iPhone或者QQHD浏览器
    iPad: u.includes('iPad'), // 是否iPad
    webApp: !u.includes('Safari'), // 是否web应用程序，没有头部与底部
    weixin: u.includes('MicroMessenger'), // 是否微信 （2015-01-22新增）
    isBaidu: u.includes('baiduboxapp'), // 是否为百度浏览器
    isqqBrowser: u.includes('mqqbrowser'), // 是否为qq浏览器
    isWxBrowser: u.includes('micromessenger'), // 是否为微信浏览器
    isUc: u.includes('ucbrowser'), // 是否为uc浏览器
  }
}
