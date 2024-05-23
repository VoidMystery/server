import { NextFunction, Request, Response } from "express";
import userService from "../service/UserService";
import { ErrorWithStatus } from "../errors/ErrorWithStatus";

class UserController {
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await userService.getAll());
        }
        catch (e) {

        }
    }

    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body
            await userService.registration(email, password);
            res.status(204).send();
        }
        catch (e) {
            if (e instanceof ErrorWithStatus) {
                res.status(e.status).send(e.message);
            } else {
                console.log(e);
            }
        }
    }

}

const userController = new UserController();

export default userController;