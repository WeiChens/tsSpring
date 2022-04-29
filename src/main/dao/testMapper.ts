import { Mapper } from "../core/mybatis/annotation";
import {OkPacket} from "mysql";


@Mapper
export default class TestMapper {
  async getUserById(id: string): Promise<any> {};
  // @ts-ignore
  async addUser(id: string, name: string, age: number): Promise<OkPacket> {};
  // @ts-ignore
  async updateUser(id:string,name:string,age:number):Promise<OkPacket>{};
  // @ts-ignore
  async delUser(id:string):Promise<OkPacket>{};

}