"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Import a entidade
const Users_1 = require("../entity/Users");
const Situation_1 = require("../entity/Situation");
//importar a biblioteca para criptografar a senha
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class CreateUsersSeed {
    run(dataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Iniciando o Seed para a tabela 'users' ...");
            //Obter o repóssitorio da entidade User e Situation
            const userRepository = dataSource.getRepository(Users_1.User);
            const situationRepository = dataSource.getRepository(Situation_1.Situation);
            //Verifica se já existem registros na tabela
            const existingCount = yield userRepository.count();
            if (existingCount > 0) {
                console.log("A tabela 'users' já possui dados. Nenhuma alteração foi realizada!");
                return;
            }
            //Buscar a situação no banco de dados
            const situation = yield situationRepository.findOne({ where: { id: 1 } });
            //Verifica se encontrou a situação no banco de dados
            if (!situation) {
                console.error("Erro: Nenhuma situação encontrada com o ID  1. Verifique se a tabela 'situations' está populada");
                return;
            }
            //Criar os usuários com a referência correta à situação
            const users = [
                {
                    id: 1,
                    name: "Leticia Rezende",
                    email: "leticia@gmail.com.br",
                    password: yield bcryptjs_1.default.hash("123456", 10),
                    situation: situation,
                },
                {
                    id: 2,
                    name: "Diego Vieira",
                    email: "diego@gmail.com.br",
                    password: yield bcryptjs_1.default.hash("123456", 10),
                    situation: situation
                },
            ];
            //Salvar os registros no banco de dados
            yield userRepository.save(users);
            console.log("Seed concluído com sucesso: usuários cadastrados!");
        });
    }
}
exports.default = CreateUsersSeed;
