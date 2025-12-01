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
exports.AuthService = void 0;
//Importar a conexão com o banco de dados
const data_source_1 = require("../data-source");
//Importar a entidade
const Users_1 = require("../entity/Users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Importar variaveis de ambiente
const dotenv_1 = __importDefault(require("dotenv"));
//Carregar as variaveis do arquivo .env
dotenv_1.default.config();
//Classe responsável pela autenticação do usuário
class AuthService {
    constructor() {
        //Criar um repositório para manipular a tabela "User" no banco de dados
        this.userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
    }
    /**
 * Método para autenticar um usuário com e-mail e senha
 * @param email - E-mail do usuário
 * @param password - Senha do usuário
 * @returns Dados do usuário autenticado e token de acesso
 * @throws Erro caso as credenciais sejam inválidas
 */
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //Buscar o usuario no banco de dados pelo email informado
            const user = yield this.userRepository.findOne({ where: { email } });
            //Se o usuário não for encontrado, lançar um erro
            if (!user) {
                throw new Error("Usuário ou senha inválidos!");
            }
            //Verificar se a senha indformada corresponde à senha amarzenda no banco
            const isPasswordValid = yield user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error("Usuário ou senha inválidos!");
            }
            //Gerar um token JWT para o usuário autenticado
            //O token inclui o ID do usuário e expira em 7 dias
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "5d" });
            //Retorna os dados do usuário autenticado junto com o token gerado
            return { id: user.id, name: user.name, email: user.email, token };
        });
    }
}
exports.AuthService = AuthService;
