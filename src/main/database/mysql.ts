import * as mysql from "mysql";
import DatabaseConfig from "./databaseConfig";


export const ResToType = function <T>(row: Array<any>): T[] {
    return row
}
export type OkPacket = {
    fieldCount: number,
    affectedRows: number,
    insertId: number,
    serverStatus: number,
    warningCount: number,
    message: string,
    protocol41: boolean,
    changedRows: number
}
export default class DB {

    private constructor() {
        this.pool = mysql.createPool(DatabaseConfig.Instance);
    }
    private pool: mysql.Pool;
    private static _instance: DB;

    public static get Instance() {
        if (!this._instance) {
            this._instance = new DB();
        }
        return this._instance;
    }

    /**
     * 插入数据
     * @param sql insert into user(name,sex,birthday) value(?,?,?)
     * @param value  
     * @returns 
     */
    public insert(sql: string, value: any[]) {
        return new Promise<OkPacket>((resolve, reject) => {
            this.pool.getConnection((err: any, conn: any) => {
                if (err) {
                    console.error("数据库连接失败=>", err);
                    reject(err);
                    return
                }
                conn.query(sql, value, (err: any, res: any) => {
                    if (err) {
                        reject(err);
                        conn.release();
                        return
                    }
                    resolve(res);
                    conn.release();
                })
            })
        })
    }

    /**
     * 查询数据
     * @param sql select * from user  where id = ?
     * @param value 
     * @returns 
     */
    public select<T = any>(sql: string, value: any[]) {
        return new Promise<Array<T>>((resolve, reject) => {
            this.pool.getConnection((err: any, conn: any) => {
                if (err) {
                    console.error("数据库连接失败=>", err);
                    reject(err);
                    return
                }
                conn.query(sql, value, (err: any, res: any) => {
                    if (err) {
                        reject(err);
                        conn.release();
                        return
                    }
                    resolve(res);
                    conn.release();
                })
            })
        })
    }
    /**
     * 更新数据
     * @param sql "update user set sex = 0 where name like ?"
     * @param value 
     * @returns 
     */
    public update(sql: string, value: any[]) {
        return new Promise<OkPacket>((resolve, reject) => {
            this.pool.getConnection((err: any, conn: any) => {
                if (err) {
                    console.error("数据库连接失败=>", err);
                    reject(err);
                    return
                }
                conn.query(sql, value, (err: any, res: any) => {
                    if (err) {
                        reject(err);
                        conn.release();
                        return
                    }
                    resolve(res);
                    conn.release();
                })
            })
        })
    }

    public delete(sql: string, value: any[]) {
        return new Promise<OkPacket>((resolve, reject) => {
            this.pool.getConnection((err: any, conn: any) => {
                if (err) {
                    console.error("数据库连接失败=>", err);
                    reject(err);
                    return
                }
                conn.query(sql, value, (err: any, res: any) => {
                    if (err) {
                        reject(err);
                        conn.release();
                        return
                    }
                    resolve(res);
                    conn.release();
                })
            })
        })
    }

}
