
import { glob } from "glob";
import http from "http"
import { GetBean } from "./ioc/beanManager";
import Request from "./http/Request";
import Response from "./http/Response";

class Router {

  private constructor() {

  }


  private static _instance: Router | undefined;
  public static get Instance() {
    if (!this._instance) {
      this._instance = new Router();
    }
    return this._instance;
  }

  private getOptions: RequestOptions[] = [];
  private postOptions: RequestOptions[] = [];

  public pushGetOptions(options: RequestOptions) {
    this.getOptions.push(options);
  }
  public pushPostOptions(options: RequestOptions) {
    this.postOptions.push(options);
  }

  public exeRouter(url: string, methodType: string, req: Request, resp: Response): void {
    switch (methodType) {
      case "GET": this.exeOptions(url, this.getOptions, req, resp); break;

      case "POST": this.exeOptions(url, this.postOptions, req, resp); break;
      case "OPTIONS": {
        resp.setHeader('Access-Control-Allow-Origin', '*')
        resp.setHeader('Access-Control-Allow-Credentials', "true");
        resp.setHeader('Access-Control-Allow-Headers', '*');
        let str = [];
        for (let option of this.getOptions) {
          if (option.url == url) {
            str.push("GET");
            break;
          }
        }
        for (let option of this.postOptions) {
          if (option.url == url) {
            str.push("POST");
            break;
          }
        }
        resp.setHeader('Access-Control-Allow-Methods', str.join(","));
        resp.setHeader('Access-Control-Allow-Methods', str.join(","));
        resp.end();
      }
        break;

    }
  }
  private exeOptions(url: string, options: RequestOptions[], req: Request, resp: Response): void {
    for (let option of options) {
      if (option.url == url) {
        option.method(req, resp);
        return;
      }
    }
    resp.statusCode = 404;
    resp.end("错误的访问路径");
  }
  public bindMethod() {
    for (let item of this.getOptions) {
      item.method = item.method.bind(GetBean(item.target));
    }
    for (let item of this.postOptions) {
      item.method = item.method.bind(GetBean(item.target));
    }
  }
}

type RequestOptions = {
  url: string,
  method: (req: Request, resp: Response) => void,
  /**
   * 类构造器
   */
  target: any
}



export const loadRouter = (folder: string) => {
  const extname = ".{ts,js}";
  glob.sync(require("path").join(folder, `./**/*${extname}`))
    .forEach(item => require(item));

  Router.Instance.bindMethod();
  return Router.Instance;
}


export default Router;