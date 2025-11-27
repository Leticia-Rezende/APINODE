// Importar o Express para definir os tipos de `Request` e `Response`
import { Request, Response, NextFunction } from "express";
// Importar a biblioteca JWT para manipular tokens
import jwt from "jsonwebtoken";
// Importar a biblioteca variáveis de ambiente
import dotenv from "dotenv";
// Carregar variáveis do arquivo .env
dotenv.config();

//Criar interface Request para receber o id do usuário
interface AuthRequest extends Request{
    user?: {id: number};
}

/**
 * Middleware para validar o token de autenticação JWT
 * @param req - Objeto da requisição
 * @param res - Objeto da resposta
 * @param next - Função para passar o controle para o proximo middleware
 */

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {

    //Obter o token do cabeçalho da requisição
    const authHeader = req.headers.authorization;

    //Verificar se o cabeçalho contém um token
    if(!authHeader){
        res.status(401).json({
            message: "Token inválido ou expirado!"
        });
        return;
    }

    //Separar o token do prefixo "Bearer"
    const [bearer, token] = authHeader.split(" ")

    //Verificar se o token foi fornecido corretamente
    if(!token || bearer.toLocaleLowerCase() !== "bearer"){
        res.status(401).json({
            message: "Token inválido!"
        });
        return;
    }

    try{
        //Verificar e decodificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {id:number};


        //Atribuir o ID do usuário autenticado à requisição para uso posterior
        req.user = {id: decoded.id}

        //Passar o controle para a proxima função na rota
        next()

    }catch(error){
        res.status(401).json({
            message: "Token inválido ou expirado!"
        });
        return;

    }
}