import { readFileSync } from "fs";
import * as jwt from "jsonwebtoken";
import { resolve } from "path";
import { RedisClientType } from "redis";
import { loadRedisClien } from "../database/redis";

const PUBLIC_KEY = readFileSync(resolve(__dirname, "../resources/public.key"));
const PRIVATE_KEY = readFileSync(resolve(__dirname, "../resources/private.key"));
/**
 * 检测token
 * @param token 
 * @returns 
 */
let redis: null | RedisClientType = null;
let isOpenRedis = true;
let db: number = 1;
export const checkToken = async (token: string, isKey: string | null = null) => {
  token = token.replace("Bearer ", "");
  return new Promise<string | jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    }, (err, data: any) => {
      if (err) {//token验证失败
        reject(err)
        return
      }
      if (data) {
        if (isKey) {
          redisCheckToken(isKey, data.id, token).then(res => {
            if (res) {
              resolve(data);
            } else {
              reject("验证失败")
            }
          })
        } else {
          resolve(data);
        }
      }
    })
  })
}

/**
 * 创建token
 * @param payload 数据
 * @param time 过期时间单位s
 * @returns 
 */
export const createToken = async (payload: any, time: number, isKey: string | null = null) => {
  let token = jwt.sign(payload, PRIVATE_KEY,
    {
      expiresIn: time,
      algorithm: "RS256"
    }
  );
  if (isKey) {
    await redisPushToken(isKey, payload.id, token, time);
  }
  return token
}
const redisPushToken = async (key: string, field: string | number, token: string, time?: number) => {
  if (!isOpenRedis) {
    return;
  }
  if (!redis) {
    redis = await loadRedisClien();
    if (!redis) {
      isOpenRedis = false;
      return
    }
  }
  try {
    await redis.select(db);
    await redis.set(`${key}:${field}`, token);
    if (time)
      redis.expire(`${key}:${field}`, time);
  } catch {
    isOpenRedis = false;
    return
  }

}

export const deleteUserToken = async(key: string,field:string|number)=>{
  if (!isOpenRedis) {
    return;
  }
  if (!redis) {
    redis = await loadRedisClien();
    if (!redis) {
      isOpenRedis = false;
      return
    }
  }
  try {
    await redis.select(db);
    await redis.del(`${key}:${field}`);
  } catch {
    isOpenRedis = false;
    return
  }
}

const redisCheckToken = async (key: string, field: string, token: string) => {
  if (!isOpenRedis) {
    return true;
  }
  if (!redis) {
    redis = await loadRedisClien();
    if (!redis) {
      isOpenRedis = false;
      return true
    }
  }
  await redis.select(db);
  let _token = await redis.get(`${key}:${field}`);
  if (_token) {

    if (token === _token) {
      return true
    }
  }
  return false
}