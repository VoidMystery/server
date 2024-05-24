import { NextFunction, Request, Response } from "express";
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
        const link = req.params.link;
        await userService.confirmEmail(link);
        res.status(204).send();
    }

}

const userController = new UserController();

export default userController;