// 新建websocket.js文件，定义先关数据，方便使用；
let socket = null
let handleMessage = null
let handleErr = null
// 初始化连接websocket，监听websocket各状态
function initSocket(url: any) {
  if (typeof WebSocket === 'undefined')
    window.console.log('初始化失败, 不支持使用WebSocket')
  // 定义scoket 请求体传参不需要加data，相当于post;
  // socket = new WebSocket(url)
  // 定义scoket 拼接传递参数需要加上data，相当于get;
  socket = new WebSocket(url)
  // 连接成功
  socket.onopen = () => {
    socketOnOpen()
  }
  // 返回数据
  socket.onmessage = (e) => {
    socketOnMessage(e)
  }
  // 连接失败
  socket.onerror = () => {
    socketOnError()
  }
  // 连接关闭时触发
  socket.onclose = () => { }
}

// 连接成功后的操作
function socketOnOpen() {
  window.console.log('连接成功')
}

// 接收到websocket传过来message后的操作
function socketOnMessage(e: { data: string }) {
  // handleMessage为组件中传过来的自定义的方法,判断是否传递过来该方法
  // if (handleMessage) {
  //     window.console.log("返回信息：");
  //     handleMessage(JSON.parse(e.data))
  // }
  // 对后端返回返回数据做处理
  if (e.data === 'Success') {
    window.console.log('首次连接返回:', 'Success')
  } else if (handleMessage) {
    window.console.log('返回数据:')
    handleMessage(e.data)
  }
}

// 连接错误后的操作
function socketOnError() {
  if (handleErr) {
    window.console.log('连接错误')
    handleErr()
  }
}

// 向websocket传递参数数据
function socketSend(data) {
  setTimeout(() => {
    if (socket.readyState === 1)
      socket.send(JSON.stringify(data))
    else if (socket.readyState === 3)
      window.console.log('WebSocket链接已关闭, 没有链接成功')
  }, 500)
}

/** 发送websocket请求
 * @param {String} url 连接的websocket地址
 * @param {Object} data 需要传递的参数
 * @param {Function} handleData 获取websocket传过来的数据后的处理函数
 * @param {Function} handleError websocket连接出错后的处理函数
 */
export function connectSocket(url, data, handleData, handleError) {
  if (handleData)
    handleMessage = handleData
  if (handleError)
    handleErr = handleError
  initSocket(url) // 初始化
  socketSend(data) // 发送参数
}

// 关闭webSocket
export function closeSocket() {
  if (socket)
    socket.close()
}
