import { BadRequestError, NotFoundError } from "@helpers/ErrorHelper";
import { Prisma, User } from "@prisma/client";
import { UserRepository } from "@repositories/UserRepository";

const userRepository = new UserRepository();

export class UserValidator {
    async validateCreate(user: Partial<User>) {
        await this.validateLogin(user.login);
        await this.validatePassword(user.password);
        await this.validateCpf(user.cpf);
        await this.validateName(user.name);
    }


    async validateUpdate(user: Partial<User>) {
        await this.validateId(user.id);
        if (user.name) await this.validateName(user.name);
        if (user.password) await this.validateLogin(user.password);
    }


    async validateRemove(id: number) {
        await this.validateId(id);
    }


    async validateGet(id: number) {
        await this.validateId(id);
    }


    async validateId(id?: number) {
        if (!id) throw new BadRequestError("ID não informado.");
        
        const userExists = await this.userExists(id);
        if (!userExists) throw new NotFoundError("Usuário não encontrado.");
    }

    
    async validateLogin(login?: string) {
        if (!login) throw new BadRequestError("Campo login é obrigatório.");
        if (login.length < 4 || login.length > 20) throw new BadRequestError("Campo login precisa ter entre 4 e 20 caracteres.");

        const loginExists = await this.loginExists(login);
        if (loginExists) throw new BadRequestError("Login já utilizado.");
    }


    async validatePassword(password?: string) {
        if (!password) throw new BadRequestError("Campo senha é obrigatório.");
        if (password.length < 4 || password.length > 20) throw new BadRequestError("Campo senha precisa ter entre 6 e 30 caracteres.");
    }


    async validateCpf(cpf?: string) {
        if (!cpf) throw new BadRequestError("Campo CPF é obrigatório.");

        const isCpfValid = await this.isCpfValid(cpf);
        if (!isCpfValid) throw new BadRequestError("Valor de CPF inválido.");

        const cpfExists = await this.cpfExists(cpf);
        if (cpfExists) throw new BadRequestError("CPF já utilizado.");
    }


    async validateName(name?: string) {
        if (!name) throw new BadRequestError("Campo nome é obrigatório.");
        if (name.length < 4 || name.length > 25) throw new BadRequestError("Campo nome precisa ter entre 4 e 25 caracteres.");
    }


    async isCpfValid(cpf: string) {       
        cpf = cpf.replace(/[^\d]+/g, '');
        
        if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
        
        const values = cpf.split('').map(el => +el);
        const rest = (count: number) => (values.slice(0, count-12).reduce( (sum, el, index) => (sum + el * (count-index)), 0 )*10) % 11 % 10;
        
        return rest(10) === values[9] && rest(11) === values[10];
    }


    async userExists(id: number) {
        const user = await userRepository.getUserById(id);
        if (user) return true;

        return false;
    }


    async cpfExists(cpf: string) {
        const user = await userRepository.getUserByCpf(cpf);
        if (user) return true;

        return false;
    }


    async loginExists(login: string) {
        const user = await userRepository.getUserByLogin(login);
        if (user) return true;

        return false;
    }
}
