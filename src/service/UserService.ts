import bcrypt from "bcrypt"
import { v4 } from "uuid"

import { Token } from "../models/token";
import { User } from "../models/user"
import mailService from "./MailService";
import { ErrorWithStatus } from "../errors/ErrorWithStatus";
import { InternalServerError } from "../errors/InternalServerError";

class UsersService {
    async getAll() {
        return await User.findAll({
            include: {
                model: Token
            }
        });
    }

    async registration(email: string, password: string) {
        if (!process.env.APP_BASE_URL) throw new InternalServerError("Can't find env variable");
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            if (user.confirmed)
                throw new ErrorWithStatus(409, "Such user is already registered")
            await mailService.sendActivationMail(user.email, `${process.env.APP_BASE_URL}api/confirm/${user.activationLink}`);
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 3);
        const activationLink = v4();
        await mailService.sendActivationMail(email, `${process.env.APP_BASE_URL}/api/confirm/${activationLink}`);
        await User.create({
            email: email,
            password: hashedPassword,
            activationLink: activationLink
        });
    }

    async confirmEmail(link: string) {
        const user = await User.findOne({
            where: {
                activationLink: link
            }
        });
        if (!user) throw new ErrorWithStatus(409, "Can't find user with that link");
        if (!user.confirmed) {
            user.confirmed = true;
            user.save();
        }
    }
}

const userService = new UsersService();

export default userService