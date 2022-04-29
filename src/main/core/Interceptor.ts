import http from "http"
import { glob } from "glob";
import Request from "./http/Request";
import Response from "./http/Response";
class FilterManager {


  private static _instance: null | FilterManager = null;

  public static get Instance() {
    if (!this._instance) {
      this._instance = new FilterManager();
    }
    return this._instance;
  }

  public pushFilter(options: FilterOptions) {
    this.filterOptions.push(options);
  }
  /**
   * 执行过滤器
   * @param url 
   * @param req request
   * @param resp response
   * @returns 状态码
   */
  public async exeFilter(url: string, req: Request, resp: Response): Promise<number> {

    if (req.nativeRequest.method === "OPTIONS") {
      return 200
    }
    const filters = this.filterOptions.filter((value: FilterOptions, index) => {
      const filterArrs = value.url.split("/");
      const urlArrs = url.split("/");
      if (value.url == url)
        return true;
      if (filterArrs.length > urlArrs.length)
        return false;

      if (filterArrs.length < urlArrs.length && filterArrs[filterArrs.length - 1] != "**") {
        return false;
      }
      for (let i = 0; i < filterArrs.length; i++) {
        const filterItem = filterArrs[i];
        const urlItem = urlArrs[i];
        if (i == filterArrs.length - 1) {
          if (filterItem == "*" || filterItem == "**") {
            return true;
          }
        }

        if (filterItem != urlItem) {
          return false;
        }
      }
    })
    filters.sort((a, b) => a.url.split("/").length - b.url.split("/").length)

    let statusCode = 200;
    for (let i = 0; i < filters.length; i++) {
      statusCode = await filters[i].method(req, resp);
      if (statusCode >= 400)
        return statusCode;
    }
    return statusCode;
  }

  private filterOptions: FilterOptions[] = [];
}

type FilterOptions = {
  url: string,
  method: (req: Request, resp: Response) => Promise<number>
}


export const loadFilter = (folder: string) => {
  const extname = ".{ts,js}";
  glob.sync(require("path").join(folder, `./**/*${extname}`))
    .forEach(item => require(item));
  return FilterManager.Instance;
}
export default FilterManager;