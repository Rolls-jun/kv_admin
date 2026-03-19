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

// 下载文件
export const downloadFile = (url) => {
  // console.log('name===',name,url)
  const link = document.createElement('a'); // 创建一个 元素
  link.href = url;  //设置链接的 href 属性
  link.download = name;  //设置文件名
  link.style.display = 'none'; // 隐藏元素
  document.body.appendChild(link); //将链接添加到文档中
  link.click(); // 模拟点击，触发下载
  document.body.removeChild(link); //下载完成，删除元素
};

const _toString = Object.prototype.toString
