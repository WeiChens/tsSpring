import { error } from "console";
import { ReadStream, Stats, statSync, writeFile, WriteStream } from "fs";
import Request from "../http/Request";

/**
 * 解析文件的实例
 */
class ParseFileData {

  constructor(request: Request) {
    this.req = request;
  }

  /**
   * 
   * @param FieldName 字段名字
   * @returns 
   */
  parseFile() {
    return new Promise<Map<string, DataMsg>>((resolve, reject) => {
      let len = 0;
      if (!this.req.headers["content-length"]) {
        reject("没有数据长度属性")
        return
      }
      len = +this.req.headers["content-length"];
      if (len === NaN) {
        reject("没有数据长度格式错误")
        return
      }
      if ((len / 1024 / 1024) > this.MaxFileSize) {
        reject(`数据长度过大,无法读取,不能大于${this.MaxFileSize}MB`)
        return
      }

      const arr: Buffer[] = [];
      this.req.nativeRequest.on("data", (buffer: Buffer) => {
        arr.push(buffer);
      });
      const end = () => {
        let data = Buffer.concat(arr);
        let map: Map<string, DataMsg> = new Map();
        if (!this.req.nativeRequest.headers['content-type']) {
          reject("请求没有类型")
          return;
        }
        let str = this.req.nativeRequest.headers["content-type"].split("; ")[1];
        if (str) {
          //分隔符
          let boundary = '--' + str.split("=")[1];
          //各个数据段
          let datas = (data.toString("binary")).split(boundary);
          //utf-8编码，可以查看中文编码
          let datas2 = (data.toString("utf-8")).split(boundary);
          //去头去尾
          datas.shift();
          datas.pop();

          datas2.shift();
          datas2.pop();

          //丢弃掉每个数据头尾的"\r\n"
          datas = datas.map(buffer => buffer.slice(2, buffer.length - 2));
          datas2 = datas2.map(buffer => buffer.slice(2, buffer.length - 2));

          for (let i = 0; i < datas.length; i++) {
            const buffer = datas[i];
            const buffer2 = datas2[i];
            let n = buffer.indexOf("\r\n\r\n");
            let n2 = buffer.indexOf("\r\n\r\n");

            //文件或字段介绍
            let disposition = buffer2.slice(0, n2);
            //文件内容
            let content = buffer.slice(n + 4);

            //文件数据
            /*Content-Disposition: form-data; name="f1"; filename="a.txt"\r\n
            Content-Type: text/plain
        */
            //普通数据
            //  Content-Disposition: form-data; name="user"
            if (disposition.indexOf("\r\n") !== -1) {//如果是文件，介绍会有两行所以会出现换行符
              let [line1, line2] = disposition.split('\r\n');
              let [, name, filename] = line1.split("; ");
              let type = line2.split(": ")[1];


              name = name.split("=")[1];
              name = name.substring(1, name.length - 1);

              filename = filename.split("=")[1];
              filename = filename.substring(1, filename.length - 1);

              map.set(name, new DataMsg(Buffer.from(content, "binary"), type, filename))
            }
          }
          resolve(map);

        } else {
          reject("错误的请求类型content-type")
        }

      }
      this.req.nativeRequest.on("end", end)
    })
  }

  /**
   * 最大文件大小 default 10MB
   */
  private MaxFileSize: number = 10;

  /**
   * 设置最大文件大小
   * @param size MB
   * @returns this
   */
  public setMaxFileSize(size: number) {
    this.MaxFileSize = size;
    return this;
  }


  private req: Request;
}
class DataMsg {
  data: Buffer
  type: string//类型
  fileName: string//数据原本名字

  constructor(data: Buffer, type: string, fileName: string) {
    this.data = data;
    this.type = type;
    this.fileName = fileName;
  }

  public pipe(path__ws: string | WriteStream, callBack?: ((error: Error | null | undefined) => void)) {
    if (path__ws instanceof WriteStream) {
      path__ws.write(this.data, callBack);
    } else {

      let path = path__ws.replace(/\\/g, "/");
      try {
        let dir = statSync(path.slice(0, path.lastIndexOf("/")));


        if (dir.isDirectory()) {
          writeFile(path, this.data, { encoding: "binary" }, () => {
            if (callBack) {
              callBack(null);
            }
          });
        } else {
          if (callBack) {
            callBack(new Error("错误的路径"));
          }
        }
      } catch (err) {
        if (callBack) {
          callBack(new Error("错误的路径"));
        }
      }

    }
  }
}

export default ParseFileData
