

export default abstract class Impl {

}
type DaoErr = {
  flag:false,
  err:string
}

type DaoResp<T>={
  flag:true,
  msg:T
}

export type DaoMsg<T> = DaoErr|DaoResp<T>;