/**
 * 获取类的成员方法keys
 * @param type 
 * @returns 
 */
export const ParseAllClassName = (type:new ()=>object)=>{
  return Reflect.ownKeys(type.prototype).filter(value=>value!=="constructor"&&typeof value === "string") as string[];
}