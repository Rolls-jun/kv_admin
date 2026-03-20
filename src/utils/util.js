import enquireJs from 'enquire.js'

export function isDef (v){
  return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    }
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}

// 判断是否合法json对象
export const isJSONString = (str) => {
  if (typeof str !== 'string') return false; // 必须先确保是字符串
  try {
    const obj = JSON.parse(str);
    // 进一步判断：解析后的结果必须是对象或数组
    // 因为 JSON 也可以表示纯数字 "123" 或布尔值 "true"，通常我们不把这些当作业务上的 "JSON 对象/数组"
    return typeof obj === 'object' && obj !== null; 
  } catch (e) {
    return false; // 解析失败，说明不是合法的 JSON 格式
  }
}
/**
* 强制下载文件 (处理跨域、Blob、URL)
* @param {string} url - 文件地址
* @param {string} filename - 保存的文件名
*/
export const downloadFile = async (url,filename) => {
 console.log('url===',url)
 console.log('filename===',filename)
 try {
  //  1. 尝试 fetch 获取 blob (解决跨域和服务器强制预览问题)
   const response = await fetch(url);
   if (!response.ok) throw new Error('网络响应失败');
   const blob = await response.blob();
   // 2. 创建临时链接
   const blobUrl = window.URL.createObjectURL(blob);
   const link = document.createElement('a');
   link.href = blobUrl;
   link.download = filename;
   // 3. 触发点击
   document.body.appendChild(link);
   link.click();
   // 4. 清理
   document.body.removeChild(link);
   window.URL.revokeObjectURL(blobUrl);
 } catch (error) {
   console.error('下载失败，尝试直接跳转:', error);
   // 降级方案：如果 fetch 失败（可能是严重的 CORS 且没配允许），只能尝试直接打开
   window.open(url, '_blank');
 }
};

const _toString = Object.prototype.toString
