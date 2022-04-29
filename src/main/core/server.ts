import {debuglog} from "util";

require('module-alias/register')
import { createServer } from "http";
import { resolve } from "path";
import Filter, { loadFilter } from "./Interceptor";
import Request from "./http/Request";
import Router, { loadRouter } from "./router";
import Response from "./http/Response";
import { loadBean } from "./ioc/beanManager";


loadBean(resolve(__dirname, "../"))

loadFilter(resolve(__dirname, "../filters"));
loadRouter(resolve(__dirname, "../controller"));

export const loadServer =()=> createServer((req, resp) => {
  const init = async () => {
    if (!req.url || !req.method) {
      resp.end();
      return;
    }
    const request = new Request(req);
    await request.parseParamsAndUrl(req.url);
    const response = new Response(resp);
    req.setEncoding("utf-8");
    resp.setHeader("Content-Type","application/json;charset=utf-8")
    let statusCode = await Filter.Instance.exeFilter(request.ContextPath, request, response);
    if (statusCode >= 400) {
      resp.statusCode = statusCode;
      resp.end();
      return;
    }
    Router.Instance.exeRouter(request.ContextPath, req.method, request, response);
  }
  init();
})
