"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
//Importar a biblioteca Express
const express_1 = __importDefault(require("express"));
//Importar a conexão com banco de dados
const data_source_1 = require("../data-source");
//Importar a entidade
const Users_1 = require("../entity/Users");
//Importar o serviço de paginação
const PaginationServices_1 = require("../services/PaginationServices");
//Importar a biblioteca para validar os dados para cadastrar e editar
const yup = __importStar(require("yup"));
//Importar o Not para utilizar como restrição para ignorar o proprio id na consulta
const typeorm_1 = require("typeorm");
//Criar a aplicação Express
const router = express_1.default.Router();
//Criar a rota para listar os usuários
//Endereço para acessar a API através da aplicação extrerna com o verb GET: https://localhost:8080/users?page=1&limit=10
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Obter o repositório da entidade User
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        //Receber o número da página e definir a página 1 como padrão
        const page = Number(req.query.page) || 1;
        //Definir o limite de registros por página
        const limite = Number(req.query.limite) || 10;
        //Usar o serviço de paginação
        const result = yield PaginationServices_1.PaginationService.paginate(userRepository, page, limite, { id: "DESC" });
        //Retornar a resposta com os dados e informações da paginação
        res.status(200).json(result);
        return;
    }
    catch (error) {
        //Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao listar os usuários!",
        });
        return;
    }
}));
//Rota paa visualizar um usuário especifico
//Endereço para acessar a API através da aplicação externa com o verbo GET: http://localhost:8080/users/:id
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Obter o ID do usuário a partir dos paramentros da requisição
        const { id } = req.params;
        //Obter o repositório da entidade User
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        //Buscar o usuário no banco de dados pelo ID
        const user = yield userRepository.findOneBy({ id: parseInt(id) });
        //Verificar se o usuário foi encontrado
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado!",
            });
        }
        //Retornar o usuário encontrado
        res.status(200).json(user);
        return;
    }
    catch (error) {
        //Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao visualizar o usuário!"
        });
    }
}));
//Criar a rota para cadastrar usuário
//Endereço para acessar a API através da aplicação externa com o verbo POST: http://localhost:8080/users
//A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
//Dados em formato de objeto
/*{
    "name": "Leticia",
    "email": "leticia@gmail.com",
    "situation": 1
}
*/
router.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Receber os dados enviados no corpo da requisição
        var data = req.body;
        //Validar os dados utilizando o yup
        const schema = yup.object().shape({
            name: yup.string().required("O campo nomé é obrigatório!").min(3, "O campo nome deve ter no minimo 3 caracteres!"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
            situation: yup.number().required("O campo situação é obrigatório!"),
        });
        //Verificar se os dados passaram pela validação
        yield schema.validate(data, { abortEarly: false });
        //Criar uma instância do repositório de User
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        //Recuperar o registro do banco de dados com o valor da coluna email
        const existingUser = yield userRepository.findOne({
            where: { email: data.email }
        });
        //Verifica se já existe um usuário com o mesmo e-mail
        if (existingUser) {
            res.status(400).json({
                message: "Já existe um usuário cadastrado com esse e-mail",
            });
            return;
        }
        //Criar um novo registro
        const newUser = userRepository.create(data);
        //Salvar o registro no banco de dados
        yield userRepository.save(newUser);
        //Retornar resposta de sucesso
        res.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            situation: newUser,
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            //Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        //Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao cadastrar usuário!"
        });
    }
}));
//Criar a rota para editar usuário
//Endereço para acessar a API através da aplicação externa com o verbo POST: http://localhost:8080/users/:id
//A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
//Dados em formato de objeto
/*{
    "name": "Diego",
    "email": "diego@gmail.com",
    "situation": 1
}
*/
router.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Obter o ID do usuário a partir dos paramentros da requisição
        const { id } = req.params;
        //Receber os dados enviados no corpo da requisição
        const data = req.body;
        //Validar os dados utilizando o yup
        const schema = yup.object().shape({
            name: yup.string().required("O campo nomé é obrigatório!").min(3, "O campo nome deve ter no minimo 3 caracteres!"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
            situation: yup.number().required("O campo situação é obrigatório!"),
        });
        //Verifica se os dados passaram pela validação
        yield schema.validate(data, { abortEarly: false });
        //Obter o repositório da entidade User
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        //Buscar o usuário no banco de dados pelo ID
        const user = yield userRepository.findOneBy({ id: parseInt(id) });
        //Verificar se o usuário foi encontrado
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado!",
            });
            return;
        }
        //Verifica se já existe outro usuário com o mesmo e-mail, mas que não seja o registro atual
        const existingUser = yield userRepository.findOne({
            where: {
                email: data.email,
                id: (0, typeorm_1.Not)(parseInt(id)), //Exclui o próprio registro da busca
            },
        });
        if (existingUser) {
            res.status(400).json({
                message: "Já existe um usuário cadastrado com esse nome!",
            });
            return;
        }
        //Atualizar os dados do usuário
        userRepository.merge(user, data);
        //Salvar as alterações no banco de dados
        const updateUser = yield userRepository.save(user);
        //Retorna resposta de sucesso
        res.status(200).json({
            message: "Usuário atualizado com sucesso!",
            user: updateUser
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            //Retorna erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        //Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao editar usuário!"
        });
    }
}));
//PAREI NO 21.00 DO VIDEO
//Exportar a instrução que esttá dentro da constante router
exports.default = router;
