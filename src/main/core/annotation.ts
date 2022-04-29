import Request from "./http/Request";
import Response from "./http/Response";
import FilterManager from "./Interceptor";
import Router from "./router";
import http from "http"

const factory = (method: string) => (url: string) => {
  return (target: any, propertrty: string, desc: TypedPropertyDescriptor<(req: Request, resp: Response) => Promise<void>>) => {
    (Router.Instance as any)[`push${method}Options`]({
      url: url,
      method: (target[propertrty] as Function),
      target: target.constructor
    })
  }
}


export const get = factory("Get");
export const post = factory("Post");


/**
 * 过滤器装饰器
 * @param path 拦截的路径
 * @returns 状态码
 */
export const Filter = (path: string) => {
  return (target: any, propertrty: string, desc: TypedPropertyDescriptor<(req: Request, resp: Response) => Promise<number>>) => {
    FilterManager.Instance.pushFilter({
      url: path,
      method: target[propertrty]
    })
  }
}