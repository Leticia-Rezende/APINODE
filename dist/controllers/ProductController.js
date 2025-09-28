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
const data_source_1 = require("../data-source");
const Product_1 = require("../entity/Product");
const PaginationServices_1 = require("../services/PaginationServices"); //Confirmar se posso usar a mesma pagina Service
//Criar a aplicação Express
const router = express_1.default.Router();
// Criar a Lista
router.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Obter o repositório da entidade Product
        const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        //Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;
        //Definir o limite de registros por página
        const limite = Number(req.query.limite) || 10;
        // Serviço de Paginação
        const result = yield PaginationServices_1.PaginationService.paginate(productRepository, page, limite, { id: "DESC" });
        //Retornar a resposta com os dados e informações da paginação
        res.status(200).json(result); //Lista todos os dados do banco
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao Listar os produtos!",
        });
        return;
    }
}));
// Criar a Visualização do item cadastrado em situação
router.get("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        const product = yield productRepository.findOneBy({ id: parseInt(id) });
        if (!product) {
            res.status(404).json({
                message: "Produto não encontrada!",
            });
            return;
        }
        res.status(200).json(product); //Lista todos os dados do banco
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao Visualizar os produtos!",
        });
        return;
    }
}));
// Cadastra item no banco de dados
router.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var data = req.body;
        const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        const newProduct = productRepository.create(data);
        yield productRepository.save(newProduct); //Isso que irá salvar no banco de dados
        res.status(201).json({
            message: "Produto cadastrado com sucesso!",
            situation: newProduct,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao cadastrar a produto!",
        });
    }
}));
// Faz a atualização do item cadastrado 
router.put("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        var data = req.body;
        const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        const product = yield productRepository.findOneBy({ id: parseInt(id) }); //Busca pelo ID digitado
        if (!product) { //Se passar um ID que não exite ele passa a seguinte mensagem
            res.status(404).json({
                message: "Produto não encontrada!",
            });
            return;
        }
        //Atualiza os dados
        productRepository.merge(product, data);
        //Salvar as alterações de dados
        const updateProduct = yield productRepository.save(product);
        res.status(200).json({
            messagem: "Produto atualizado com sucesso!",
            product: updateProduct,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao Atualizar o produto!",
        });
        return;
    }
}));
// Remove o item cadastrado no banco de dados
router.delete("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        const product = yield productRepository.findOneBy({ id: parseInt(id) }); //Busca pelo ID digitado
        if (!product) { //Se passar um ID que não exite ele passa a seguinte mensagem
            res.status(404).json({
                message: "Produto não encontrado!",
            });
            return;
        }
        //Remove os dados no banco
        yield productRepository.remove(product);
        res.status(200).json({
            messagem: "Produto foi removido com sucesso!",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao Atualizar o produto!",
        });
        return;
    }
}));
//Exportar a instrução da rota
exports.default = router;
