import {SuperController} from "../core/CSD/Controller";
import {Controller} from "../core/CSD/annotation";
import {get} from "../core/annotation";
import Request from "../core/http/Request";
import Response from "../core/http/Response";
import TestService from "../service/TestService";
import {Autowired} from "../core/ioc/annotation";


@Controller
export default class TestController{
    @Autowired(TestService)
    service: TestService;


    @get("/test")
    async test(req:Request,resp:Response){
        resp.push({
            flag:true,
            msg:"hello world!",
            message:"访问成功"
        })
    }

}