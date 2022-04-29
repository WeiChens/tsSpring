import { readdirSync, readFileSync } from "fs"
import { resolve } from "path"
import xml_js from "xml-js"
export const mapperMap: Map<string, mapper> = new Map();
let isLoad = false;
export const parseMappers = () => {
  if (isLoad)
    return
  const path = resolve(__dirname, "../../mapper");
  const dir = readdirSync(path)
  dir.forEach((value, index, arr) => {
    const msg = readFileSync(resolve(path, value));
    const josn = xml_js.xml2json(msg.toString(), {
      compact: true,
      spaces: 4
    })
    const res = JSON.parse(josn);
    const mapper: mapper = res.mapper;
    try {
      if (mapper && mapper._attributes.namespace) {
        mapperMap.set(mapper._attributes.namespace, mapper);
      }
    } catch{
      console.error("xml文件格式错误");
    }

  })
  isLoad = true;
}
export type exe = {
  _attributes: {
    id: string
  },
  _text: string,
}
export type mapper = {
  _attributes: {
    namespace: string
  },
  insert: exe | exe[],
  update: exe | exe[],
  select: exe | exe[],
  delete: exe | exe[]
}