import { User } from "../models/user";

export class UserDTO {
    id: number;
    email: string;
    confirmed: boolean;

    constructor(user: Required<User>){
        this.id = user.id;
        this.email = user.email;
        this.confirmed = user.confirmed;
    }

}