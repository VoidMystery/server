import { NextFunction, Request, Response } from "express";

import { InternalServerError } from "../errors/InternalServerError";
import userService from "../service/UserService";

class UserController {
    async getUsers(req: Request, res: Response, next: NextFunction) {
        res.json(await userService.getAll());
    }

    async registration(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body
        await userService.registration(email, password);
        res.status(204).send();
    }

    async confirmEmail(req: Request, res: Response, next: NextFunction) {
        if(!process.env.CLIENT_BASE_URL) throw new InternalServerError("Can't find env variable")
        const link = req.params.link;
        const tokens = await userService.confirmEmail(link);
        if (tokens) 
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.redirect(process.env.CLIENT_BASE_URL);
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
        const refreshToken: string = req.body.refreshToken;
        if (!refreshToken) {
            res.status(400).send("Can't find parameters");
            return;
        }
        await userService.logout(refreshToken);
        res.status(204).send();
    }

}

const userController = new UserController();

export default userController;