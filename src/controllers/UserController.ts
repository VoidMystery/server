import { NextFunction, Request, Response } from "express";

import { InternalServerError } from "../errors/InternalServerError";
import userService from "../service/UserService";
import { RequestWithUser } from "../middleware/authMiddleware";
import tokenService, { JWTPayloadWithUserDTO } from "../service/TokenService";

class UserController {
    async getUsers(req: Request, res: Response, next: NextFunction) {
        const userReq = req as RequestWithUser;
        console.log(userReq.user);
        res.json(await userService.getAll());
    }

    async registration(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body
        await userService.registration(email, password);
        res.status(204).send();
    }

    async confirmEmail(req: Request, res: Response, next: NextFunction) {
        if (!process.env.CLIENT_BASE_URL) throw new InternalServerError("Can't find env variable")
        const link = req.params.link;
        await userService.confirmEmail(link);
        res.redirect(`${process.env.CLIENT_BASE_URL}login`);
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const email: string = req.body.email;
        const password: string = req.body.password;
        if (!email || !password) {
            res.status(400).send("Can't find parameters");
            return;
        }
        const tokens = await userService.login(email, password);
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.status(200).send(tokens);
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        const refreshToken: string | undefined = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(400).send("Can't find cookie");
            return;
        }
        await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        res.status(204).send();
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        const refreshToken: string | undefined = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(400).send("Can't find cookie");
            return;
        }

        const userData = tokenService.validateRefreshToken(refreshToken) as JWTPayloadWithUserDTO;
        if (!userData) {
            res.status(400).send("Invalid refreshToken");
            return;
        }
        
        await tokenService.deleteOneByToken(refreshToken);
        const tokens = await tokenService.generateTokens(userData.userDTO);
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.status(200).send(tokens);
    }

}

const userController = new UserController();

export default userController;