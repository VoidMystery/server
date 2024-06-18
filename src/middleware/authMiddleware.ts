import { Request, Response, NextFunction } from "express"

import { InternalServerError } from "../errors/InternalServerError";
import { ErrorWithStatus } from "../errors/ErrorWithStatus";
import tokenService from "../service/TokenService";
import { UserDTO } from "../dto/UserDTO";

export interface RequestWithUser extends Request{
    user: UserDTO
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!process.env.CLIENT_BASE_URL) throw new InternalServerError("Can't find env variable")
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.redirect(`${process.env.CLIENT_BASE_URL}/login`);
        return next();
    }
    const accessToken = authHeader.split(' ')[1];
    if(!accessToken) throw new ErrorWithStatus(401, "Incorrect access token");
    const userData = tokenService.validateAccessToken(accessToken);
    const myRequest = req as RequestWithUser
    myRequest.user = userData as UserDTO;
    next();
}

export default authMiddleware;