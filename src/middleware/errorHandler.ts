import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "../errors/ErrorWithStatus";
import { InternalServerError } from "../errors/InternalServerError";
import { TokenExpiredError } from "jsonwebtoken";

export const errorHandler = (e: Error, req: Request, res: Response, next: NextFunction) => {
    if (e instanceof ErrorWithStatus) {
        res.statusMessage = e.message;
        res.status(e.status).end();
        return;
    }
    if (e instanceof InternalServerError) {
        console.log(e.reason);
        res.statusMessage
        res.status(e.status).send(e.message);
        return;
    }
    if (e instanceof TokenExpiredError) {
        res.statusMessage = `Token expired at ${e.expiredAt}`;
        res.status(401).end();
        return;
    }
    res.statusMessage = `Server do not know what happening ;p`;
    res.status(500).end();
    console.log(e);

}