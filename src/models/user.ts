import { DataTypes, Model, InferAttributes } from "sequelize";
import { getSequelize } from "./sequelize";
import { Token } from "./token";

export interface User extends Model<InferAttributes<User>> {
    id?: number,
    email: string,
    password: string,
    activationLink: string,
    confirmed?: boolean
}

export const User = getSequelize().define<User>('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    activationLink: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})

User.hasMany(Token, {
    foreignKey: {
        name: 'usersId',
        allowNull: false
    }
});
Token.belongsTo(User, {
    foreignKey: {
        name: 'usersId',
        allowNull: false
    }
});