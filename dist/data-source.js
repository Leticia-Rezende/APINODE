"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Situation_1 = require("./entity/Situation");
const Users_1 = require("./entity/Users");
const Product_1 = require("./entity/Product");
const ProductCategory_1 = require("./entity/ProductCategory");
const ProductSituation_1 = require("./entity/ProductSituation");
//Importar variaveis de ambiente
const dotenv_1 = __importDefault(require("dotenv"));
// Carregar as variavies do .env
dotenv_1.default.config();
const dialect = (_a = process.env.DB_DIALECT) !== null && _a !== void 0 ? _a : "mysql";
exports.AppDataSource = new typeorm_1.DataSource({
    type: dialect,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Situation_1.Situation, Users_1.User, Product_1.Product, ProductCategory_1.ProductCategory, ProductSituation_1.ProductSituation],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"], //aqui deu um erro
});
//Inicializar a conexao com o banco de dodos
exports.AppDataSource.initialize().then(() => {
    console.log("Conexão do banco de dados realizada com sucesso!");
}).catch((error) => {
    console.log("Erro na conexão com o banco de dados!", error);
});
