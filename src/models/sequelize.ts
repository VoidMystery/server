import { Sequelize } from "sequelize";
import 'dotenv/config'

let sequelize: Sequelize;
export const getSequelize = (): Sequelize => {
    if (sequelize) return sequelize;
    try {
        if (!process.env.DATABASE || !process.env.USER || !process.env.PASSWORD || !process.env.HOST || !process.env.CONNECTION_LIMIT) throw new Error("Can't find env variable");
        sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
            host: process.env.HOST,
            dialect: 'mysql',

            pool: {
                max: Number.parseInt(process.env.CONNECTION_LIMIT)
            }
        })
    } catch (e) {
        console.log(e)
    }
    return sequelize;
};