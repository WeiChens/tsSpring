import { glob } from "glob";
import { resolve } from "path";
import { SuperController } from "../CSD/Controller";
import SuperService from "../CSD/Service";
export const BeanParams: Map<Object, { paramsName: string, type: Object }[]> = new Map();
export const BeanManager: Object[] = [];
let isLoad = false;


/**
 * 判断这个类是否是另一个类的派生类
 * @param classConstructor 派生类
 * @param parentConstructor 父类
 */
export const isParent = (classConstructor: any, parentConstructor: any) => {
  let _class: any = classConstructor;

  while (_class) {
    if (_class.__proto__ === parentConstructor) {
      return true;
    }
    _class = _class.__proto__;
  }
  return false
}


/**
 * 实现自动装配
 */
const assembling = () => {
  for (let [key, value] of BeanParams) {
    for (let instance of BeanManager) {
      if (instance instanceof (key as any)) {
        for (let params of value) {
          for (let instance2 of BeanManager) {
            if (instance2 instanceof (params.type as any)) {
              (instance as any)[params.paramsName] = instance2;
              break;
            }
          }
        }
      }
    }
  }
}
/**
 * 加载Bean
 * @param folder 
 */
export const loadBean = (folder: string) => {
  const extname = ".{ts,js}";
  glob.sync(require("path").join(folder, `./**/*${extname}`))
    .forEach(item => {
      require(item);

    });
  assembling();
  isLoad = true;
  return BeanManager;
}
/**
 * 根据类型获取Bean
 * @param type 
 */
export const GetBean = <T extends Object>(type: any): T | null => {
  if (!isLoad) {
    loadBean(resolve(__dirname, "./"))
  }
  for (let bean of BeanManager) {
    if (bean instanceof type) {
      return bean as T;
    }
  }
  return null
}


