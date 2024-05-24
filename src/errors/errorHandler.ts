import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "./ErrorWithStatus";
import { InternalServerError } from "./InternalServerError";

export const errorHandler = (e: Error, req: Request, res: Response, next: NextFunction) => {
    if (e instanceof ErrorWithStatus) {
        res.status(e.status).send(e.message);
    } else if (e instanceof InternalServerError) {
        console.log(e.reason);
        res.status(e.status).send(e.message);
    } else {
        res.status(500).send("Server do not know what happening ;p");
        console.log(e);
    }

}