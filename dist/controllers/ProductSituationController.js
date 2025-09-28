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
const ProductSituation_1 = require("../entity/ProductSituation");
const PaginationServices_1 = require("../services/PaginationServices"); //Confirmar se posso usar a mesma pagina Service
//Criar a aplicação Express
const router = express_1.default.Router();
// Criar a Lista
router.get("/product_situations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Obter o repositório da entidade Product
        const productSituationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        //Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;
        //Definir o limite de registros por página
        const limite = Number(req.query.limite) || 10;
        // Serviço de Paginação
        const result = yield PaginationServices_1.PaginationService.paginate(productSituationRepository, page, limite, { id: "DESC" });
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
router.get("/product_situations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productSituationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const productSituation = yield productSituationRepository.findOneBy({ id: parseInt(id) });
        if (!productSituation) {
            res.status(404).json({
                message: "Produto não encontrada!",
            });
            return;
        }
        res.status(200).json(productSituation); //Lista todos os dados do banco
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
router.post("/product_situations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var data = req.body;
        const productSituationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const newProductSituation = productSituationRepository.create(data);
        yield productSituationRepository.save(newProductSituation); //Isso que irá salvar no banco de dados
        res.status(201).json({
            message: "Produto cadastrado com sucesso!",
            situation: newProductSituation,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao cadastrar a produto!",
        });
    }
}));
// Faz a atualização do item cadastrado 
router.put("/product_situations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        var data = req.body;
        const productSituationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const productSituation = yield productSituationRepository.findOneBy({ id: parseInt(id) }); //Busca pelo ID digitado
        if (!productSituation) { //Se passar um ID que não exite ele passa a seguinte mensagem
            res.status(404).json({
                message: "Produto não encontrada!",
            });
            return;
        }
        //Atualiza os dados
        productSituationRepository.merge(productSituation, data);
        //Salvar as alterações de dados
        const updateProductSituation = yield productSituationRepository.save(productSituation);
        res.status(200).json({
            messagem: "Produto atualizado com sucesso!",
            product: updateProductSituation,
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
router.delete("/product_situations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productSituationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const productSituation = yield productSituationRepository.findOneBy({ id: parseInt(id) }); //Busca pelo ID digitado
        if (!productSituation) { //Se passar um ID que não exite ele passa a seguinte mensagem
            res.status(404).json({
                message: "Produto não encontrado!",
            });
            return;
        }
        //Remove os dados no banco
        yield productSituationRepository.remove(productSituation);
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
