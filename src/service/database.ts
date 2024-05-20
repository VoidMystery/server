import mysql from 'mysql2';
import 'dotenv/config';
import { Pool } from 'mysql2/promise';

let pool: Pool;
export const getPool = (): Pool => {
    if (pool) return pool;
    pool = mysql.createPool({
        connectionLimit: Number(process.env.CONNECTION_LIMIT),
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DATABASE,
        password: process.env.PASSWORD
    }).promise();
    return pool;
};