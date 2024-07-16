import sequelize, { DataTypes, Model } from './db/index';
import Sequelize from "sequelize";
import Auth from "../model/auth";
import { getSalt, hashSeasonPassword, compareHashes } from "../utils/password-hash";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

class User extends Model {

    static associate(models: any) {
        User.hasOne(models.Auth, {
            foreignKey: "userId",
            onDelete: "CASCADE",
            as: "auth",
        });
    };

    private static async createHashedSeasonPassword(password: string) {
        const salt = getSalt();
        const hashPassword = hashSeasonPassword(password, salt).toString("hex");
        const hashedPassword = `${salt}:${hashPassword}`;
        return hashedPassword;
    };

    static async getUser(email: string) {
        const userInfo = await User.findOne({ where: { email } });
        return { userInfo };
    };

    static async createUser(userData: any) {
        const { username, fullname, password, email, birthdate, nationality } =
            userData;

        const existingUser = await User.findOne({
            where: {
                email,
            },
        });
        if (existingUser) {
            return { error: "User with the provided email already exists" };
        };

        const hashedPassword = await this.createHashedSeasonPassword(password);

        const newUser = await User.create({
            username,
            fullname,
            email,
            birthdate,
            nationality,
        });
        await Auth.createAuth({
            id: newUser.dataValues.id,
            password: hashedPassword,
        });

        return {
            message: `User ${fullname} created successfully`,
            id: newUser.dataValues.id,
        };
    };

    static async updateUser(id: string, userdata: any) {
        const { username, fullname, password, email, nationality, birthdate } = userdata
        const result = await User.findOne({ where: { id } });

        if (result) {
            await result.update({
                username,
                fullname,
                email,
                birthdate: new Date(birthdate),
                nationality,
                password
            },
            );

            await result.save();
            if (password) {
                const auth = await Auth.findOne({
                    where: { userId: id },
                });
                if (auth) {
                    await auth.update({ password });
                    await auth.save();
                };
            };

            return result;
        };
        return 404;
    };

    static async deleteUser(email: string) {
        const user = await User.findOne({ where: { email } });

        if (!user) return 400;

        const id = user.dataValues.id;

        try {
            await User.destroy({
                where: {
                    id,
                },
            });
            await Auth.destroy({ where: { userId: id } });
            return 200;
        } catch (error) {
            return 400;
        };
    };

    static async login(userCredentials: any) {
        const { email, password } = userCredentials;

        const user = await User.findOne({ where: { email } });
        if (user) {
            const auth = await Auth.findOne({
                where: { userId: user.dataValues.id },
            });


            if (auth) {

                const [salt, dbHashedPassword] = await auth.dataValues.password.split(":");
                const hashedPassword = hashSeasonPassword(password, salt);
                const equalPasswords = compareHashes(dbHashedPassword, hashedPassword);

                if (equalPasswords) {
                    const refreshToken = generateRefreshToken(user.dataValues.id);
                    const accessToken = generateAccessToken(user.dataValues.id);

                    await auth.update({ accessToken, refreshToken });
                    await auth.save();

                    return {
                        message: "User logged successfully!",
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    };

                };

            };
        };
        return { error: 'Invalid credentials' };;
    };

    static async logout(email: string) {
        try {
            const user = await User.getUser(email);

            if (!user || !user.userInfo) {
                return 400; 
            };

            const id = user.userInfo.dataValues.id;
            await Auth.update({ refreshToken: null }, { where: { userId: id } });

            return 200;
        } catch (error) {
            return 500;
        };
    };

};

User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "Users",
        timestamps: false,
    }
);

User.hasOne(Auth, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});

Auth.belongsTo(User, {
    foreignKey: "userId",
});

(async () => await User.sync({ alter: true }))();

export default User;