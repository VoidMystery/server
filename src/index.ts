import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
require('express-async-errors');

import router from './router';
import {getSequelize} from './models/sequelize';
import { errorHandler } from './middleware/errorHandler';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_BASE_URL
}));
app.use('/api', router);
app.use(errorHandler)

const start = async () => {
    try {
        await getSequelize().authenticate();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();