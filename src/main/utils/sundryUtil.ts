
/**
 * 将特殊的对象转换从普通对象
 * @param from 来源
 * @param attr 要转换的属性,默认全部转换
 * @returns 
 */
export const SpecialObjToSimpleness = <T>(from: any, attrs?: Array<keyof T>): T => {
  const obj: any = {};
  for (let key in from) {
    if (attrs) {
      if (attrs.includes(key as any)) {
        obj[key] = from[key];
      }
    } else {
      obj[key] = from[key];
    }

  }
  return obj;
}

/**
 * 将特殊的对象数组转化为普通的对象数组
 * @param from 开源
 * @param atrtr 对象需要转换的属性
 * @returns 
 */
export const SpecialArrayToSimpleness = <T>(from: Array<any>, attrs?: Array<keyof T>): T[] => {
  const arr: Array<any> = []
  for(let item of from){
    arr.push(SpecialObjToSimpleness(item,attrs)) 
  }
  return arr
}