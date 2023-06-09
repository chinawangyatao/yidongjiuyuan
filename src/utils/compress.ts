// base64转blob
export function convertBase64UrlToBlob(urlData: any) {
  const arr = urlData.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--)
    u8arr[n] = bstr.charCodeAt(n)
  return new Blob([u8arr], { type: mime })
}

// base64转file
function base64ToImageFile(base64) {
  // 将base64字符串转换为Blob对象
  const byteCharacters = atob(base64.split(',')[1])
  const byteArrays = []
  for (let i = 0; i < byteCharacters.length; i++)
    byteArrays.push(byteCharacters.charCodeAt(i))

  const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' })

  // 将Blob对象转换为File对象
  const fileName = 'image.jpg' // 可以根据实际情况设置文件名
  const file = new File([blob], fileName, { type: 'image/jpeg' })

  return file
}

export function compressImage(path: any) {
  // 最大高度
  const maxHeight = 500
  // 最大宽度
  const maxWidth = 500
  return new Promise((resolve) => {
    const img = new Image()
    img.src = path
    img.onload = function () {
      const originHeight = img.height
      const originWidth = img.width
      let compressedWidth = img.height
      let compressedHeight = img.width
      if ((originWidth > maxWidth) && (originHeight > maxHeight)) {
        // 更宽更高，
        if ((originHeight / originWidth) > (maxHeight / maxWidth)) {
          // 更加严重的高窄型，确定最大高，压缩宽度
          compressedHeight = maxHeight
          compressedWidth = maxHeight * (originWidth / originHeight)
        } else {
          // 更加严重的矮宽型, 确定最大宽，压缩高度
          compressedWidth = maxWidth
          compressedHeight = maxWidth * (originHeight / originWidth)
        }
      } else if (originWidth > maxWidth && originHeight <= maxHeight) {
        // 更宽，但比较矮，以maxWidth作为基准
        compressedWidth = maxWidth
        compressedHeight = maxWidth * (originHeight / originWidth)
      } else if (originWidth <= maxWidth && originHeight > maxHeight) {
        // 比较窄，但很高，取maxHight为基准
        compressedHeight = maxHeight
        compressedWidth = maxHeight * (originWidth / originHeight)
      } else {
        // 符合宽高限制，不做压缩
      }
      // 生成canvas
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = compressedHeight
      canvas.width = compressedWidth
      context.clearRect(0, 0, compressedWidth, compressedHeight)
      context.drawImage(img, 0, 0, compressedWidth, compressedHeight)
      const base64 = canvas.toDataURL('image/*', 0.8)
      const blob = convertBase64UrlToBlob(base64)
      const imageAssets = base64ToImageFile(base64)
      // 回调函数返回blob的值。也可根据自己的需求返回base64的值
      resolve(imageAssets)
    }
  })
}

