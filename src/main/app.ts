
require('module-alias/register')
import { loadServer } from "./core/server";



const server = loadServer()


server.listen(3000,()=>{
  console.log("服务启动...");
  
})