import bcrypt from "bcrypt"
import { v4 } from "uuid"

import { Token } from "../models/token";
import { User } from "../models/user"
import mailService from "./MailService";
import { ErrorWithStatus } from "../errors/ErrorWithStatus";
import { InternalServerError } from "../errors/InternalServerError";
import tokenService from "./TokenService";
import { UserDTO } from "../dto/UserDTO";

class UsersService {

    private static SALT_ROUNDS = 3;

    async getAll() {
        return await User.findAll({
            include: {
                model: Token
            }
        });
    }

    async findOneById(id: number) {
        return await User.findAll({
            where:{
                id: id
            }
        });
    }

    async registration(email: string, password: string) {
        if (!process.env.SERVER_BASE_URL) throw new InternalServerError("Can't find env variable");
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            if (user.confirmed)
                throw new ErrorWithStatus(409, "Such user is already registered")
            await mailService.sendActivationMail(user.email, `${process.env.SERVER_BASE_URL}/api/confirm/${user.activationLink}`);
            return;
        }
        const hashedPassword = await bcrypt.hash(password, UsersService.SALT_ROUNDS);
        const activationLink = v4();
        await mailService.sendActivationMail(email, `${process.env.SERVER_BASE_URL}/api/confirm/${activationLink}`);
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
            await user.save();
        }
    }

    async login(email: string, password: string) {
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user || !await bcrypt.compare(password, user.password)) throw new ErrorWithStatus(404, "Wrong authorization data");
        const {accessToken, refreshToken} = await tokenService.generateTokens(user as Required<User>);
        return { accessToken, refreshToken, userDTO: new UserDTO(user as Required<User>) };
    }

    async logout(refreshToken: string) {
        const token = await tokenService.deleteOneByToken(refreshToken);
        if(!token) return;
    }
}

const userService = new UsersService();

export default userService