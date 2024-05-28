import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user';
import 'dotenv/config'
import { Token } from '../models/token';
import { UserDTO } from '../dto/UserDTO';
import { InternalServerError } from '../errors/InternalServerError';

export type JWTPayloadWithUserDTO = JwtPayload & {
    userDTO: UserDTO
}

class TokenService {
    private static REFRESH_TOKEN_EXPIRE_TIME = "30d"; //in days
    private static ACCESS_TOKEN_EXPIRE_TIME = "30m";

    async generateTokens(payloads: Required<User> | UserDTO) {
        if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) throw new InternalServerError("Can't find env variable");
        let userDTO: UserDTO;
        if (payloads instanceof UserDTO) {
            userDTO = payloads;
        } else {
            userDTO = new UserDTO(payloads);
        }

        const accessToken = jwt.sign({ userDTO }, process.env.JWT_ACCESS_SECRET, { expiresIn: TokenService.ACCESS_TOKEN_EXPIRE_TIME });
        const refreshToken = jwt.sign({ userDTO }, process.env.JWT_REFRESH_SECRET, { expiresIn: TokenService.REFRESH_TOKEN_EXPIRE_TIME });

        const expireDate = new Date()
        expireDate.setDate(expireDate.getDate() + Number(TokenService.REFRESH_TOKEN_EXPIRE_TIME.slice(0, 2)))

        // expireDate = expireDate.toISOString().split("T")[0];
        await Token.create({
            token: refreshToken,
            expireDate: expireDate,
            usersId: payloads.id
        })

        return { accessToken, refreshToken };
    }

    async deleteOneByToken(refreshToken: string) {
        return await Token.destroy({
            where: {
                token: refreshToken
            }
        });
    }

    async findOneByToken(refreshToken: string) {
        return await Token.findOne({
            where: {
                token: refreshToken
            }
        });
    }

    validateAccessToken(accessToken: string) {
        if (!process.env.JWT_ACCESS_SECRET) throw new InternalServerError("Can't find env variable");
        return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    }

    validateRefreshToken(refreshToken: string) {
        if (!process.env.JWT_REFRESH_SECRET) throw new InternalServerError("Can't find env variable");
        return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    }
}

const tokenService = new TokenService();
export default tokenService;