import { Request, Response, NextFunction } from "express"

import { InternalServerError } from "../errors/InternalServerError";
import { ErrorWithStatus } from "../errors/ErrorWithStatus";
import tokenService from "../service/TokenService";
import { UserDTO } from "../dto/UserDTO";

export interface RequestWithUser extends Request {
    user: UserDTO
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!process.env.CLIENT_BASE_URL) throw new InternalServerError("Can't find env variable")
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new ErrorWithStatus(401, "Missing auth header");
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) throw new ErrorWithStatus(401, "Incorrect access token");
    try {
        const userData = tokenService.validateAccessToken(accessToken);
        const myRequest = req as RequestWithUser
        myRequest.user = userData as UserDTO;
    } catch (e) {
        next(e);
    }
    next();
}

export default authMiddleware;