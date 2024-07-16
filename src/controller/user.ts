import { Request, Response } from 'express';
import User from '../model/user';
import { validateUser, validatePartialUser } from '../schemas/users';
import logger from "../utils/logs";

abstract class UserController {

    static async getUser(req: Request, res: Response) {
        const { email } = req.params;
        try {
            const user = await User.getUser(email);
            res.status(200).json(user);
            logger.info("User found");
        } catch (error) {
            res.status(404).json({ message: "User not found" });
        };
    };

    static async createUser(req: Request, res: Response) {
        const { username, fullname, email, nationality, password } = req.body;
        let { birthdate } = req.body;

        if (!username || !fullname || !email || !birthdate || !nationality || !password) {
            return res.status(400).json({ error: 'data error' });
        };

        try {
            birthdate = new Date(birthdate);
            const validatedData = validateUser({
                username,
                fullname,
                password,
                email,
                birthdate,
                nationality,
            });

            if (!validatedData.success) {
                logger.error("The data entered is incorrect");
                return res.status(400).json({
                    message:
                        "Incorrect data entered. Please check again. Password has to be at least 8 characters long, should include capital letters, numbers and special characters.",
                });
            };

            const response = await User.createUser(validatedData.data);
            logger.info("User succesfully created");
            return res.status(201).json(response);
        } catch (error) {
            logger.error("Error while creating user");
            return res.status(500).json({ message: "Error creating user" });
        };
    };

    static async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const userData = req.body;
    
        try {
            // Extraer las propiedades específicas que se pueden actualizar
            const { username, fullname, password, email, nationality } = req.body;
            
            // Validar los datos que se pueden actualizar
            const dataToValidate = {
                username,
                fullname,
                password,
                email,
                nationality,
            };
    
            const validatedData = validatePartialUser(dataToValidate);
            if (!validatedData.success) {
                logger.error("Wrong credentials");
                return res.status(400).json({ message: "Wrong credentials" });
            }
    
            // Actualizar el usuario en la base de datos
            const result = await User.updateUser(id, userData);
            if (!result) {
                logger.error("User not found or no changes made");
                return res.status(404).json({ message: 'User not found or no changes made' });
            }
    
            logger.info("User updated successfully");
            return res.status(200).json({ message: 'User updated successfully' });
    
        } catch (error) {
            logger.error("Error updating user", error);
            return res.status(500).json({ error: 'Error updating user' });
        }
    }
    

    static async deleteUser(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const deleted = await User.deleteUser(id);
            if (!deleted) {
                logger.error(`User with ID ${id} not found or no changes made`);
                return res.status(404).json({ message: 'User not found or no changes made' });
            }

            logger.info(`User deleted successfully with ID: ${id}`);
            return res.status(200).json({ message: 'User deleted successfully' });

        } catch (error) {
            logger.error(`Error deleting user`);
            return res.status(500).json({ message: 'Error deleting user' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const validatedData = validatePartialUser(req.body);
            if (!validatedData.success) {
                logger.error("Wrong credentials");
                return res.status(400).json({ message: "Wrong credentials..." });
            }

            const { email, password } = validatedData.data as any;
            const user = await User.login({ email, password });
            if (!user)
                return res.status(500).json({ message: "Wrong credentials" });

            const { accessToken, refreshToken } = user as any;

            res
                .status(200)
                .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "strict",
                })
                .set("Authorization", accessToken)
                .send({
                    message: "User logged in successfully",
                    accessToken: accessToken


                });
            logger.info("User logged in successfully");
        } catch (error) {
            logger.error("Error in login process");
            return res.status(500).json({ message: "Error in login process" });
        }
    }

    static async logout(req: Request, res: Response) {
        const validatedData = validatePartialUser(req.body);
        if (!validatedData.success) {
            logger.error("Wrong credentials");
            return res.status(400).json({ message: "Wrong credentials" });
        }

        const { email } = validatedData.data as any;

        const userLogOut = await User.logout(email);

        if (userLogOut == 200) {
            logger.info("Sucessful logout");
            return res.status(200).json({ message: "Sucessful logout" });
        }
        logger.error("Error at logout");
        return res.status(500).json({ message: "Error at logout" });
    }
}

export default UserController;