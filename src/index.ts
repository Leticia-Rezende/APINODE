// importar a biblioteca do Express
import express from "express";

//Importar variaveis de ambiente
import dotenv from "dotenv";

//Importar a biblioteca para permitir conexão externa
import cors from 'cors';

//Carregar as variaveis do arquivo .env
dotenv.config()

//Criar a aplicação Express
const app = express();

//Criar um middleware para receber os dados no corpo da requisição
app.use(express.json());

//Criar o midldleware para permitir requisição externa
app.use(cors());

//Incluir os controlleres
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";
import ProductController from "./controllers/ProductController";
import ProductSituationController from "./controllers/ProductSituationController";
import ProductCategoryController from "./controllers/ProductCategoryController";
import TestConnectionCOntroller from "./controllers/TestConnectionController";


//Criar as rotas
app.use("/", AuthController)
app.use("/", SituationsController)
app.use("/", ProductController)
app.use ("/", ProductCategoryController)
app.use ("/", ProductSituationController)
app.use ("/", TestConnectionCOntroller)


//Iniciar o servidor na porta definida na variável de ambiente
app.listen(process.env.PORT,() => {
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
})