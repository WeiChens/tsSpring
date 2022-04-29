import Impl, { DaoMsg } from "./Dao";

export default abstract class SuperService<dao extends object|null>{
  protected get dao(): dao {
    if (this._dao) {
      return this._dao;
    }
    throw "_dao null AutoWired 装配失败 "
  }
  /**
   * 使用Autowired自动装配
   */
  abstract _dao: dao | undefined
}

export type ServiceMsg<T> = DaoMsg<T>;