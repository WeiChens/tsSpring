import {Service} from "../core/CSD/annotation";
import TestMapper from "../dao/testMapper";
import {Autowired} from "../core/ioc/annotation";

@Service
export  default class TestService{

    async addUser(id:string,name:string,age:number){
        return this.dao.addUser(id,name,age);
    }
    async getUserById(id:string){
        return this.dao.getUserById(id)
    }
    async updateUser(id:string,name:string,age:number){
        return this.dao.updateUser(id,name,age);
    }

    @Autowired(TestMapper)
    dao: TestMapper;
}