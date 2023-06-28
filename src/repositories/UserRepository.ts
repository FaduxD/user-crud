import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
    async getAll() {
        const users = await prisma.user.findMany();

        return users;
    }


    async getUserById(id: number) {
        const user = await prisma.user.findFirst({
            where: {
                id
            }
        });

        return user;
    }


    async getUserByCpf(cpf: string) {
        const user = await prisma.user.findFirst({
            where: {
                cpf
            }
        });

        return user;
    }


    async getUserByLogin(login: string) {
        const user = await prisma.user.findFirst({
            where:{
                login
            }
        });

        return user;
    }


    async create(user: Prisma.UserCreateInput) {
        await prisma.user.create({
            data: user
        });
    }


    async update(id: number, user: Prisma.UserUpdateInput) {
        await prisma.user.update({
            data: user,
            where: {
                id
            }
        });
    }

    
    async remove(id: number) {
        await prisma.user.delete({
            where: {
                id
            }
        });
    }
}
