import { DataTypes, Model, InferAttributes } from "sequelize";
import { getSequelize } from "./sequelize";

export interface Token extends Model<InferAttributes<Token>> {
    id?: number,
    token: string,
    expireDate: Date
    usersId: number
}

export const Token = getSequelize().define<Token>("token", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    token: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    expireDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    usersId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
})