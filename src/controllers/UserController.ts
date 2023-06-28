import { UserRepository } from "@repositories/UserRepository";
import { Request, Response } from "express";
import { Prisma, User } from "@prisma/client";
import { UserValidator } from "src/validators/UserValidator";
import bcrypt from "bcrypt";

const userValidator = new UserValidator();
const userRepository = new UserRepository();

export class UserController {

    async getAll(req: Request, res: Response) {
        const users = await userRepository.getAll();

        return res.json(users);
    }


    async getById(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);

        await userValidator.validateGet(id);

        const user = await userRepository.getUserById(id);

        return res.json(user);
    }


    async create(req: Request, res: Response) {
        const { name, cpf, login, password } = req.body;
        const user: Partial<User> = { name, cpf, login, password }
        user.cpf = user.cpf?.replaceAll(".", "").replaceAll("-", "");

        await userValidator.validateCreate(user);

        const validatedUser = user as Prisma.UserCreateInput;
        validatedUser.password = await bcrypt.hash(password, 10);

        await userRepository.create(validatedUser);

        return res.status(201).json({ message: "Usuário criado com sucesso." });
    }


    async update(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);
        const { name, password } = req.body;
        const user: Partial<User> = { id, name, password };

        await userValidator.validateUpdate(user);

        const validatedUser = user as Prisma.UserUpdateInput;

        await userRepository.update(id, validatedUser);

        return res.status(200).json({ message: "Usuário atualizado com sucesso." });
    }


    async remove(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);

        await userValidator.validateRemove(id);

        await userRepository.remove(id);

        return res.status(200).json({ message: "Usuário removido com sucesso." });
    }

    
    async render(req: Request, res: Response) {
        res.sendFile('users.html', {
            root: './src/views/components/users/'
        });
    }

}
