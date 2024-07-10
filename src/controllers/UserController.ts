import { Request, Response } from "express";

import { InternalServerError } from "../errors/InternalServerError";
import userService from "../service/UserService";
import { RequestWithUser } from "../middleware/authMiddleware";
import tokenService, { JWTPayloadWithUserDTO, REFRESH_TOKEN_EXPIRE_TIME_IN_SECONDS } from "../service/TokenService";

class UserController {
    async getUsers(req: Request, res: Response) {
        const userReq = req as RequestWithUser;
        console.log(userReq.user);
        // const excludeVocabulary = new Map<string, void>();

        // excludeVocabulary.set("auth/login");

        // console.log(excludeVocabulary.has("auth/login"));
        // res.status(204).send();
        res.json(await userService.getAll());
    }

    async registration(req: Request, res: Response) {
        const { email, password } = req.body
        if (!email || !password) {
            res.statusMessage = "Can't find parameters";
            res.status(400).end();
            return;
        }
        await userService.registration(email, password);
        res.status(204).send();
    }

    async confirmEmail(req: Request, res: Response) {
        if (!process.env.CLIENT_BASE_URL) throw new InternalServerError("Can't find env variable")
        const link = req.params.link;
        await userService.confirmEmail(link);
        res.redirect(`${process.env.CLIENT_BASE_URL}/login`);
    }

    async login(req: Request, res: Response) {
        const email: string = req.body.email;
        const password: string = req.body.password;
        if (!email || !password) {
            res.statusMessage = "Can't find parameters";
            res.status(400).end();
            return;
        }
        const tokensWithUserDTO = await userService.login(email, password);
        res.cookie('refreshToken', tokensWithUserDTO.refreshToken, { maxAge: REFRESH_TOKEN_EXPIRE_TIME_IN_SECONDS*1000, httpOnly: true });
        res.status(200).send(tokensWithUserDTO);
    }

    async logout(req: Request, res: Response) {
        const refreshToken: string | undefined = req.cookies.refreshToken;
        if (!refreshToken) {
            res.statusMessage = "Cookie is missing";
            res.status(400).end();
            return;
        }
        await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        res.status(204).send();
    }

    async refresh(req: Request, res: Response) {
        const refreshToken: string | undefined = req.cookies.refreshToken;
        if (!refreshToken) {
            res.statusMessage = "Cookie is missing";
            res.status(400).end();
            return;
        }

        const userData = tokenService.validateRefreshToken(refreshToken) as JWTPayloadWithUserDTO;
        if (!userData) {
            res.statusMessage = "Invalid refreshToken";
            res.status(400).end();
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