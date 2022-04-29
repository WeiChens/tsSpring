import { BeanManager, BeanParams } from "./beanManager";

/**
 * 类装饰器:注入Bean
 * @param classConstructor 
 */
export const Bean = (classConstructor: new () => object) => {
  BeanManager.push(new classConstructor());
}
/**
 * 属性装饰器:自动装配
 * @param type 
 */
export const Autowired = (type: new()=>object) => {
  return (target:any, paramsName: string) => {
    let arr: Array<{ paramsName: string, type: Object }> | undefined;
    if (arr = BeanParams.get(target.constructor)) {
      arr.push({ paramsName, type });
      return
    }
    arr = [];
    BeanParams.set(target.constructor, arr);
    arr.push({ paramsName, type });
  }
}