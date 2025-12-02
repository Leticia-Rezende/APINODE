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
// importar a biblioteca do Express
const express_1 = __importDefault(require("express"));
const AuthService_1 = require("../services/AuthService");
//Importar a conexão com banco de dados
const data_source_1 = require("../data-source");
//Importar a entidade
const Users_1 = require("../entity/Users");
//Importar a biblioteca para validar os dados para cadastrar e editar
const yup = __importStar(require("yup"));
//Importar a biblioteca para gerar a chave recuperar senha
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
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
// Criar a rota para recuperar a senha
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/recover-password
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "urlRecoverPassword": "http://localhost",
    "email": "leticia@gmail.com.br"
}
*/
router.post("/recover-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Receber os dados enviados no corpo da requisição
        var data = req.body;
        //Validar os dados utilizando o yup
        const schema = yup.object().shape({
            urlRecoverPassword: yup.string().required("A URL é obrigatória!"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
        });
        //Verificar se os dados passaram pela validação
        yield schema.validate(data, { abortEarly: false });
        //Criar uma instância do repositório de User
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        //Recuperar o registro do banco de dados com o valor da coluna email
        const user = yield userRepository.findOneBy({ email: data.email });
        //Verifica se já existe um usuário com o mesmo e-mail
        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado",
            });
            return;
        }
        //Gera um token seguro de 64 caracteres
        user.recoverPassword = crypto_1.default.randomBytes(32).toString("hex");
        //Salvar as alterações no banco de dados
        yield userRepository.save(user);
        // Criar a variavél com as credenciais do servidor para enviar e-mail
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        //Criar a variavel com o conteúdo do e-mail
        var message_content = {
            from: process.env.EMAIL_FROM,
            to: data.email,
            subject: "Recuperar senha",
            text: `Prezando(a) ${user.name} \n\n
        Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.\n\n
        Clique ou copie o link para criar uma nova senha em nosso sistema:
        ${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}\n\n
        Esta mensagem foi enviada a você pela empresa ${process.env.APP}.\n\n
        Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}.
        Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita
        o preenchimento de senhas e informações cadastrais.\n\n`, // Conteúdo do e-mail somente texto
            html: `Prezando(a) ${user.name} <br><br>
        Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.<br><br>
        Clique ou copie o link para criar uma nova senha em nosso sistema:
        ${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}<br><br>
        Esta mensagem foi enviada a você pela empresa ${process.env.APP}.<br><br>
        Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}.
        Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita
        o preenchimento de senhas e informações cadastrais.<br><br>`, // HTML body
        };
        transporter.sendMail(message_content, function (err) {
            if (err) {
                console.log("Erro ao enviar email: ", err);
                res.status(200).json({
                    message: `E-mail não enviado, tente novamente ou contate ${process.env.EMAIL_ADM}`,
                });
                return;
            }
            else {
                //Retornar resposta de sucesso
                res.status(200).json({
                    message: "Email enviado! Verifique sua caixa de entrada!",
                    urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
                });
                return;
            }
        });
    }
    catch (error) {
        //Retornar erro em caso de falha
        if (error instanceof yup.ValidationError) {
            // Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        // Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao recuperar a senha do usuário!",
        });
    }
}));
// Criar a rota para validar a chave recuperar a senha
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/validate-recover-password
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "recoverPassword": "chave-recuperar-senha",
    "email": "baiao@baiao.com.br"
}
*/
router.post("/validate-recover-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Receber os dados enviados no corpo da requisição
        var data = req.body;
        //Validar os dados utilizando o yup
        const schema = yup.object().shape({
            recoverPassword: yup.string().required("A chave é obrigatória!"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
        });
        //Verificar se os dados passaram pela validação
        yield schema.validate(data, { abortEarly: false });
        //Criar uma instância do repositório de User
        const userRepository = data_source_1.AppDataSource.getRepository(Users_1.User);
        //Recuperar o registro do banco de dados com o valor da coluna email
        const user = yield userRepository.findOneBy({ email: data.email, recoverPassword: data.recoverPassword });
        //Verifica se já existe um usuário com o mesmo e-mail
        if (!user) {
            res.status(404).json({
                message: "A chave recuper senha é inválida!",
            });
            return;
        }
        res.status(200).json({
            message: "A chave recuper senha é válida!",
        });
        return;
    }
    catch (error) {
        //Retornar erro em caso de falha
        if (error instanceof yup.ValidationError) {
            // Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        // Retornar erro em caso de falha
        res.status(500).json({
            message: "A chave recuper senha é inválida!",
        });
    }
}));
//Exportar a instrução da rota
exports.default = router;
//Iniciar o servidor na porta definida na variável de ambiente
//app.listen(8080, () => {
//  console.log("Servidor iniciado na porta 8080: http://localhost:8080")
//})
