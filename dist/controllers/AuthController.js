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
// importar a biblioteca do Express
const express_1 = __importDefault(require("express"));
const AuthService_1 = require("../services/AuthService");
//Criar a aplicação Express
const router = express_1.default.Router();
// Criar a rota para realizar o login
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "email": "baiao@baiao.com.br",
    "password": "123456"
}
*/
// Criar a rota POST principal
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Extrair "email" e "senha" do corpo da requisição
        const { email, password } = req.body;
        //Verifica sse "email" e "password" foram fornecidos
        if (!email || !password) {
            res.status(400).json({
                message: "Email e senha são obrigatórios!"
            });
            return;
        }
        //Criar uma instância do seriço de autenticação
        const authService = new AuthService_1.AuthService();
        //Chamar o método "login" para validar as credenciais e obter os dados do usuário
        const userData = yield authService.login(email, password);
        res.status(200).json({
            message: "Login realizado com sucesso!",
            user: userData
        });
        return;
    }
    catch (error) {
        //Retornar erro em caso de falha
        res.status(401).json({
            message: error.message || "Erro ao realizar o login!"
        });
        return;
    }
}));
//Exportar a instrução da rota
exports.default = router;
//Iniciar o servidor na porta definida na variável de ambiente
//app.listen(8080, () => {
//  console.log("Servidor iniciado na porta 8080: http://localhost:8080")
//})
