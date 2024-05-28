import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "../errors/ErrorWithStatus";
import { InternalServerError } from "../errors/InternalServerError";
import { TokenExpiredError } from "jsonwebtoken";

export const errorHandler = (e: Error, req: Request, res: Response, next: NextFunction) => {
    if (e instanceof ErrorWithStatus) {
        res.status(e.status).send(e.message);
        return;
    }
    if (e instanceof InternalServerError) {
        console.log(e.reason);
        res.status(e.status).send(e.message);
        return;
    }
    if (e instanceof TokenExpiredError) {
        res.status(401).send(`Token expired at ${e.expiredAt}`);
        return;
    }
    res.status(500).send("Server do not know what happening ;p");
    console.log(e);

}