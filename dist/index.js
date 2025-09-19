"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importar a biblioteca do Express
const express_1 = __importDefault(require("express"));
//Importar variaveis de ambiente
const dotenv_1 = __importDefault(require("dotenv"));
//Carregar as variaveis do arquivo .env
dotenv_1.default.config();
//Criar a aplicação Express
const app = (0, express_1.default)();
//Criar um middleware para receber os dados no corpo da requisição
app.use(express_1.default.json());
//Incluir os controlleres
const AuthController_1 = __importDefault(require("./controllers/AuthController"));
const SituationsController_1 = __importDefault(require("./controllers/SituationsController"));
//Criar as rotas
app.use("/", AuthController_1.default);
app.use("/", SituationsController_1.default);
//Iniciar o servidor na porta definida na variável de ambiente
app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});
