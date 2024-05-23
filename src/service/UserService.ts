import bcrypt from "bcrypt"
import { v4 } from "uuid"

import { Token } from "../models/token";
import { User } from "../models/user"
import mailService from "./MailService";
import { ErrorWithStatus } from "../errors/ErrorWithStatus";

class UsersService {
    async getAll() {
        return await User.findAll({
            include: {
                model: Token
            }
        });
    }

    async registration(email: string, password: string) {
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (user) throw new ErrorWithStatus(409, "Such user is already registered")
        const hashedPassword = await bcrypt.hash(password, 3);
        const activationLink = v4();
        await mailService.sendActivationMail(email, activationLink);
        await User.create({
            email: email,
            password: hashedPassword,
            activationLink: activationLink
        });
    }

    async confirmEmail(link: string) {

    }
}

const userService = new UsersService();

export default userService