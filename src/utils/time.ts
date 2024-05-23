// 封装一个函数：获取一个结果：当前早上|上午|中午|下午|晚上
export const getTime = () => {
  let time = ''
  // 通过内置的构造函数Date
  let hour = new Date().getHours()
  if (hour < 9) {
    time = '早上'
  } else if (hour <= 12) {
    time = '上午'
  } else if (hour <= 14) {
    time = '中午'
  } else if (hour <= 18) {
    time = '下午'
  } else {
    time = '晚上'
  }
  return time
}
