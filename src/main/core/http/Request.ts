import http from "http";
import querystring from "querystring"
const URL = require("url")
class Request {


  private req: http.IncomingMessage;

  /**
   * 获取原生的request
   */
  public get nativeRequest() {
    return this.req;
  }
  constructor(req: http.IncomingMessage) {
    this.req = req;
    this.mapParams = new Map;
    this.ContextPath = ""
    if (!req.url) {
      return;
    }
  }
  /**
   * 解析参数
   * @param url 
   * @returns 
   */
  parseParamsAndUrl(url: string) {
    return new Promise<void>((resolve, reject) => {
      const res = URL.parse(url, true);
      this.ContextPath = res.pathname;
      for (let key in res.query) {
        this.mapParams.set(key, res.query[key]);
        this.params[key] = res.query[key];
      }
      if (this.req.method === "GET") {
        resolve();
        return
      }

      if (this.req.method === "POST") {

        let length = +(this.req.headers['content-length'] || "0");
        if (length > this.MAX_PARAMS_LENGTH) {
          resolve();
          return
        }

        if (Request.mime(this).includes("application/x-www-form-urlencoded") && Request.hasBody(this)) {
          const buffers: Buffer[] = []
          this.req.on("data", (data: Buffer) => {
            buffers.push(data);
          })
          this.req.on("end", () => {
            let str = Buffer.concat(buffers).toString();
            let query: any = querystring.parse(str)
            for (let key in query) {
              this.mapParams.set(key, query[key]);
              this.params[key] = query[key];
            }
            resolve()
            return
          })
        } else
          if (Request.mime(this).includes("application/json") && Request.hasBody(this)) {

            const buffers: Buffer[] = []
            this.req.on("data", buffer => {
              buffers.push(buffer);
            })
            this.req.on("end", () => {
              const reqParamsStr = Buffer.concat(buffers).toString();
              try {
                const reqParamsBody = JSON.parse(reqParamsStr);
                if (typeof reqParamsBody.data == "object") {
                  for (let key in reqParamsBody.data) {
                    this.mapParams.set(key, reqParamsBody.data[key]);
                    this.params[key] = reqParamsBody.data[key];
                  }
                }
              } catch (err) {
              } finally {
                resolve();
                return
              }
            })
          } else {
            resolve();
            return
          }
      }
      if (this.req.method === "OPTIONS") {
        resolve();
      }
    })
  }


  /**
   * 请求参数
   */
  public mapParams: Map<string, string>;

  public params: any = {};

  /**
   * 上下文路径例如/test/man
   */
  public ContextPath: string;

  public get statusCode() {
    return this.req.statusCode;
  }
  public get headers() {
    return this.req.headers
  }

  /**
   * 最大post参数大小(不包含文件传输) 3M
   */
  private readonly MAX_PARAMS_LENGTH = 1024 * 1024 * 3;
  /**
   * 返回content-type类型
   * @param req 
   */
  public static mime(req: Request) {
    let str = req.nativeRequest.headers["content-type"] || "";
    return str.split(";")[0];
  }
  public static hasBody(req: Request) {
    return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
  };


}

export default Request;