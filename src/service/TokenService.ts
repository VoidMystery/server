import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user';
import 'dotenv/config'
import { Token } from '../models/token';
import { UserDTO } from '../dto/UserDTO';
import { InternalServerError } from '../errors/InternalServerError';

export type JWTPayloadWithUserDTO = JwtPayload & {
    userDTO: UserDTO
}

//                                                  s  m  h  d
export const REFRESH_TOKEN_EXPIRE_TIME_IN_SECONDS = 60*60*60*30;
export const ACCESS_TOKEN_EXPIRE_TIME_IN_SECONDS = 60*60;

class TokenService {

    private JWT_ACCESS_SECRET;
    private JWT_REFRESH_SECRET;

    constructor(){
        if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) throw new InternalServerError("Can't find env variable");
        this.JWT_ACCESS_SECRET=process.env.JWT_ACCESS_SECRET;
        this.JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET;

    }

    async generateTokens(payloads: Required<User> | UserDTO) {
        
        let userDTO: UserDTO;
        if (payloads instanceof UserDTO) {
            userDTO = payloads;
        } else {
            userDTO = new UserDTO(payloads);
        }

        const accessToken = jwt.sign({ userDTO }, this.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME_IN_SECONDS });
        const refreshToken = jwt.sign({ userDTO }, this.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE_TIME_IN_SECONDS});

        const expireDate = new Date()
        expireDate.setDate(expireDate.getDate() + Math.floor(REFRESH_TOKEN_EXPIRE_TIME_IN_SECONDS/60/60/60));

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
        return jwt.verify(accessToken, this.JWT_ACCESS_SECRET);
    }

    validateRefreshToken(refreshToken: string) {
        return jwt.verify(refreshToken, this.JWT_REFRESH_SECRET);

    }
}

const tokenService = new TokenService();
export default tokenService;