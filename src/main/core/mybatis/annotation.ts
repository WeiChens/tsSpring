import { ParseAllClassName } from "src/main/utils/reflect"
import { Bean } from "../ioc/annotation";
import { mapperMap, parseMappers, mapper, exe } from "./parseMapper";
import DB from "src/main/database/mysql";
import { createUnzip } from "zlib";

export const Mapper = (target: new () => object) => {
  Bean(target)
  parseMappers();
  const mapper = mapperMap.get(target.name) as mapper;
  if (!mapper) {
    return
  }
  const map: Map<string, Function> = new Map();
  const setSql = (exe: exe, meth: (sql: string, args: any[]) => any) => {     
    map.set(exe._attributes.id, async function () {
      const args: any[] = [];
      let sql = exe._text.trim();
      const reg = /\#({)[\d]+(})/g;
      sql = sql.replace(reg, str => {
        const ind = +str.split("#{")[1].split("}")[0]
        if (!isNaN(ind))
          args.push(arguments[ind])
        return "?"
      })
      return meth(sql, args);
    })
    
  }

  const createMapper = (key: keyof mapper) => {
    if (key == "_attributes") return
    if (key == "select") return
    if (mapper[key] instanceof Array) {
      for (let item of (mapper[key] as exe[])) {
        setSql(item, async (sql, args) => {
          try{
            return (await DB.Instance[key](sql, args)).affectedRows;
          }catch{
            return 0
          }
        });
      }
    } else if (mapper[key] !==undefined) {
      setSql((mapper[key] as exe), async (sql, args) => {
        try{
          return (await DB.Instance[key](sql, args)).affectedRows;
        }catch{
          return 0
        }
      });
    }
  }
  createMapper("update");
  createMapper("insert");
  createMapper("delete");

  if (mapper.select instanceof Array) {
    for (let item of (mapper.select as exe[])) {
      setSql(item, async (sql, args) => {
        return await DB.Instance.select(sql, args)
      });
    }
  } else {
    setSql((mapper.select as exe), async (sql, args) => {
      return DB.Instance.select(sql, args)
    });
  }

  const keys = ParseAllClassName(target);

  for (let key of keys) {
    let fun: Function = map.get(key) as Function;
    if (fun) {
      const berfor = (target.prototype[key] as Function);
      target.prototype[key] = ({
        [key]() {
          berfor.bind(this, ...arguments)();
          return fun.bind(this, ...arguments)();
        }
      })[key]
    }
  }
}

