import * as redis from "redis";
import { RedisClientType } from "redis";


export const loadRedisClien= async ():Promise<null|RedisClientType>=>{
    return new Promise((resolve,reject)=>{
        let client:null|RedisClientType = null;
    try{
        client = redis.createClient({
            password:"123456",
        })
        client.on("error", (err)=>{  
            console.log("redis数据库连接失败");
            console.log("Error :" , err);  
            resolve(null)
        });  
    
        client.on('connect', ()=>{  
            if(!client){
                resolve(null)
                return
            }
            client.ping().then(res=>{
                console.log('Redis连接成功.');  
                resolve(client)
            },err=>{
                console.log("ping失败");
                resolve(null)
            })
        })  
        
        client.connect();
        }catch{
            console.log("redis数据库连接失败");
            resolve(null)
        }
    })
};






