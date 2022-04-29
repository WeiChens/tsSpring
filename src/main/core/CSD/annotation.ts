import { Bean } from "../ioc/annotation";
import { isParent } from "../ioc/beanManager";
export const Service = (classConstructor: new ()=>object) => {
  // if (isParent(classConstructor, SuperService)) {
    Bean(classConstructor);
  //   return
  // }
  //
  // throw classConstructor + " 使用Service装饰器的类还需要继承SuperService类"
}
export const Controller = (classConstructor: any) => {
  // if (isParent(classConstructor, SuperController)) {
    Bean(classConstructor);
  //   return
  // }
  // throw classConstructor + " 使用Controller装饰器的类还需要继承SuperController类"
}
/**
 * @param classConstructor 
 */
export const Repository = (classConstructor: any) => {
  Bean(classConstructor);
}

export const AutoWiredErr = () => {
  return new Error("Autowored 装配失败");
}