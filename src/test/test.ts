require('module-alias/register')
import { readFileSync } from "fs";
import { resolve } from "path";
import { xml2json } from "xml-js";


async function main(){
  const str = readFileSync(resolve(__dirname,"../main/mapper/testMapper.xml")).toString();

  const xml = xml2json(str,{compact:true,spaces:4})
  console.log(xml);
  
}
main();