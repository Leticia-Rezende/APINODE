"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
// Importar a biblioteca JWT para manipular tokens
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Importar a biblioteca variáveis de ambiente
const dotenv_1 = __importDefault(require("dotenv"));
// Carregar variáveis do arquivo .env
dotenv_1.default.config();
/**
 * Middleware para validar o token de autenticação JWT
 * @param req - Objeto da requisição
 * @param res - Objeto da resposta
 * @param next - Função para passar o controle para o proximo middleware
 */
function verifyToken(req, res, next) {
    //Obter o token do cabeçalho da requisição
    const authHeader = req.headers.authorization;
    //Verificar se o cabeçalho contém um token
    if (!authHeader) {
        res.status(401).json({
            message: "Token inválido ou expirado!"
        });
        return;
    }
    //Separar o token do prefixo "Bearer"
    const [bearer, token] = authHeader.split(" ");
    //Verificar se o token foi fornecido corretamente
    if (!token || bearer.toLocaleLowerCase() !== "bearer") {
        res.status(401).json({
            message: "Token inválido!"
        });
        return;
    }
    try {
        //Verificar e decodificar o token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        //Atribuir o ID do usuário autenticado à requisição para uso posterior
        req.user = { id: decoded.id };
        //Passar o controle para a proxima função na rota
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Token inválido ou expirado!"
        });
        return;
    }
}
