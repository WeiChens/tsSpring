import { stat } from "fs";
import http from "http"

class Response {

  constructor(resp: http.ServerResponse) {
    this.resp = resp;
  }


  private resp: http.ServerResponse;

  public get nativeResponse() {
    return this.resp;
  }

  public setHeader(name: string, value: string | number) {
    this.resp.setHeader(name, value);
  }

  public end(chunk: any = null) {
    this.resp.setHeader("Content-Type","text/html;charset=utf-8")
    if (chunk) {
      this.resp.end(chunk);
    } else {
      this.resp.end();
    }

  }
  /**
   * 重定向
   */
  public redirect(url: string) {
    this.resp.writeHead(301, {
      Location: url
    })
    this.resp.end();
  }
  public write(chunk: any): void {
    this.resp.write(chunk);
  }

  public get statusCode() {
    return this.resp.statusCode;
  }
  public set statusCode(code: number) {
    this.resp.statusCode = code;
  }
  public push(msg: respMsg, statusCode?: number) {
    if (statusCode) {
      this.resp.statusCode = statusCode;
    }
    this.resp.setHeader("Content-Type", "application/json;charset=utf-8");
    this.nativeResponse.end(JSON.stringify(msg));
  }
}
type respMsg = {
  msg?: unknown,
  flag: boolean,
  message: string
}

export default Response;