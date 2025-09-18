// importar a biblioteca do Express
import express from "express";
//Importar variaveis de ambiente
import dotenv from "dotenv";
//Carregar as variaveis do arquivo .env
dotenv.config();
//Criar a aplicação Express
const app = express();
//Criar um middleware para receber os dados no corpo da requisição
app.use(express.json());
//Incluir os controlleres
import AuthController from "./controllers/AuthController.js";
import SituationsController from "./controllers/SituationsController.js";
//Criar as rotas
app.use("/", AuthController);
app.use("/", SituationsController);
//Iniciar o servidor na porta definida na variável de ambiente
app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});
