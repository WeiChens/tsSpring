

class DateUtle {
  /**
   * 返回时间字符串=> yyyy-MM-dd
   */
  static getNowFormat() {
    let date = new Date();
    let y = date.getFullYear();
    let M = date.getMonth() + 1;
    let d = date.getDay();
    return `${y}-${M}-${d}`
  }
  /**
   * 返回时间字符串=> yyyy-MM-dd hh:mm:ss
   * @returns 
   */
  static getNowDataTimeFormat(){
    let date = new Date();
    let y = date.getFullYear();
    let M = date.getMonth() + 1;
    let d = date.getDay();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    return `${y}-${M}-${d} ${h}:${m}:${s}`
  }
}

export default DateUtle;