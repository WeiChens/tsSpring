import { readFile, readFileSync } from "fs";
import { resolve } from "path";

class DatabaseConfig {


    private constructor(){
        let conf = readFileSync(resolve(__dirname,"../resources/application.json")).toString();

        let config = JSON.parse(conf);
        this.host =config.database.host;
        this.database =config.database.database;
        this.port =config.database.port;
        this.user =config.database.user;
        this.password =config.database.password;
        this.timezone =config.database.timezone;
    }
    public readonly host: string
    public readonly database: string
    public readonly port: number
    public readonly user: string
    public readonly password: string
    public readonly timezone: string

    private static _instance:DatabaseConfig|undefined;

    public static get Instance(){
        if(!this._instance){
            this._instance = new DatabaseConfig();
        }
        return this._instance;
    }
}

export default DatabaseConfig;