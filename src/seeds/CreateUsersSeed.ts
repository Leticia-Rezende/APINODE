//Importar a conxeção com o banco de dados
import { DataSource } from "typeorm";
//Import a entidade
import {User} from "../entity/Users";
import { Situation } from "../entity/Situation";
//importar a biblioteca para criptografar a senha
import bcrypt from "bcryptjs";

export default class CreateUsersSeed {
    public async run (dataSource: DataSource): Promise<void>{
        console.log ("Iniciando o Seed para a tabela 'users' ...");

        //Obter o repóssitorio da entidade User e Situation
        const userRepository = dataSource.getRepository(User);
        const situationRepository = dataSource.getRepository(Situation);

        //Verifica se já existem registros na tabela
        const existingCount = await userRepository.count();
        if(existingCount > 0){
            console.log ("A tabela 'users' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        //Buscar a situação no banco de dados
        const situation = await situationRepository.findOne({ where: {id: 1}});

        //Verifica se encontrou a situação no banco de dados
        if(!situation){
            console.error("Erro: Nenhuma situação encontrada com o ID  1. Verifique se a tabela 'situations' está populada");
            return;
        }

        //Criar os usuários com a referência correta à situação
        const users = [
            {
                id: 1,
                name: "Leticia Rezende",
                email: "leticia@gmail.com.br",
                password: await bcrypt.hash("123456", 10),
                situation: situation,
            },
            {
                id:  2,
                name: "Diego Vieira",
                email: "diego@gmail.com.br",
                password: await bcrypt.hash("123456", 10),
                situation: situation
            },
        ];

        //Salvar os registros no banco de dados
        await userRepository.save(users);
        console.log ("Seed concluído com sucesso: usuários cadastrados!");
    }
}