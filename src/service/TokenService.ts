import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import 'dotenv/config'
import { Token } from '../models/token';
import { UserDTO } from '../dto/UserDTO';
import { ErrorWithStatus } from '../errors/ErrorWithStatus';
import { InternalServerError } from '../errors/InternalServerError';

class TokenService {
    private static REFRESH_TOKEN_EXPIRE_TIME = "30d"; //in days
    private static ACCESS_TOKEN_EXPIRE_TIME = "30m";

    generateTokens(payloads: Required<User>) {
        if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) throw new InternalServerError("Can't find env variable");

        let expireDate = new Date();
        expireDate.setMonth(new Date().getMonth() - 1);

        const userDTO = new UserDTO(payloads);

        const accessToken = jwt.sign(userDTO, process.env.JWT_ACCESS_SECRET, { expiresIn: TokenService.ACCESS_TOKEN_EXPIRE_TIME });
        const refreshToken = jwt.sign(userDTO, process.env.JWT_REFRESH_SECRET, { expiresIn: TokenService.REFRESH_TOKEN_EXPIRE_TIME });

        return { accessToken, refreshToken };
    }

    async saveRefreshToken(userId: number, refreshToken: string) {
        if (!process.env.JWT_REFRESH_SECRET) throw new InternalServerError("Can't find env variable");
        const expireDate = new Date()
        expireDate.setDate(expireDate.getDate() + Number(TokenService.REFRESH_TOKEN_EXPIRE_TIME.slice(0, 2)))

        // expireDate = expireDate.toISOString().split("T")[0];
        Token.create({
            token: refreshToken,
            expireDate: expireDate,
            usersId: userId
        })
    }
}

const tokenService = new TokenService();
export default tokenService;