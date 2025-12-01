//Importar a conexão com o banco de dados
import { AppDataSource } from "../data-source";
//Importar a entidade
import { User } from "../entity/Users";

import jwt from "jsonwebtoken";
//Importar variaveis de ambiente
import dotenv from "dotenv";
//Carregar as variaveis do arquivo .env
dotenv.config();

//Classe responsável pela autenticação do usuário
export class AuthService{

    //Criar um repositório para manipular a tabela "User" no banco de dados
    private userRepository = AppDataSource.getRepository(User);

    /**
 * Método para autenticar um usuário com e-mail e senha
 * @param email - E-mail do usuário
 * @param password - Senha do usuário
 * @returns Dados do usuário autenticado e token de acesso
 * @throws Erro caso as credenciais sejam inválidas
 */

    async login(email: string, password: string) : Promise<{id: number; name: string; email: string; token: string}>{
        //Buscar o usuario no banco de dados pelo email informado
        const user = await this.userRepository.findOne({where:{email}})

        //Se o usuário não for encontrado, lançar um erro
        if (!user){
            throw new Error( "Usuário ou senha inválidos!")
        }

        //Verificar se a senha indformada corresponde à senha amarzenda no banco
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid){
            throw new Error( "Usuário ou senha inválidos!")
        }


        //Gerar um token JWT para o usuário autenticado
        //O token inclui o ID do usuário e expira em 7 dias
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET as string, {expiresIn: "5d"});

        //Retorna os dados do usuário autenticado junto com o token gerado
        return {id: user.id, name: user.name, email: user.email, token}
    }
}