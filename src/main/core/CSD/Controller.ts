import SuperService from "./Service";

export abstract class SuperController<T extends SuperService<any>>{

  get service(): T {
    if (this._service) {
      return this._service
    }
    throw "Autowired 装配失败"
  }
  /**
   * 使用Autowired装饰器自动装配
   */
  abstract _service: T | undefined
}