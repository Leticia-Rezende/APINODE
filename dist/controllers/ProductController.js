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
const data_source_1 = require("../data-source");
const Product_1 = require("../entity/Product");
const PaginationServices_1 = require("../services/PaginationServices"); //Confirmar se posso usar a mesma pagina Service
const yup = __importStar(require("yup"));
const slugify_1 = __importDefault(require("slugify"));
//Criar a aplicação Express
const router = express_1.default.Router();
// Criar a Lista
//Endereço para acessar a api através da aplicação com o verbo GET: http://localhost:8080/products?page=1&limite=10
router.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Obter o repositório da entidade Product
        const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        //Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;
        //Definir o limite de registros por página
        const limite = Number(req.query.limite) || 10;
        // Serviço de Paginação
        const result = yield PaginationServices_1.PaginationService.paginate(productRepository, page, limite, { id: "DESC" }, ["situation", "product_situations"]);
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
        //Obter o ID do produto a partir dos parâmetros da requisição
        const { id } = req.params;
        //Obter o repositorio da entidade Product
        const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        //Buscar o produto no banco de dados
        const product = yield productRepository.findOne({
            relations: ["situation", "category"],
            where: { id: parseInt(id) }
        });
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
        //Receber os dados enviados no corpo da requisição
        var data = req.body;
        //Valida os dados utilizando o yup
        const schema = yup.object().shape({
            name: yup
                .string()
                .required("O campo nome é obrigatório!")
                .min(3, "O campo nome deve ter no mínimo 3 caracteres!")
                .max(255, "O campo nome deve ter no máximo 255 caracteres!"),
            slug: yup
                .string()
                .required("O campo slug é obrigatório!")
                .min(3, "O campo slug deve ter no mínimo 3 caracteres!")
                .max(255, "O campo slug deve ter no máximo 255 caracteres!"),
            description: yup
                .string()
                .required("O campo descrição é obrigatório!")
                .min(10, "A descrição deve ter pelo menos 10 caracteres!"),
            price: yup
                .number()
                .typeError("O preço deve ser um número!")
                .required("O campo preço é obrigatório!")
                .positive("O preço deve ser um valor positivo!")
                .test("is-decimal", "O preço deve ter no máximo duas casas decimais!", (value) => /^\d+(\.\d{1,2})?$/.test((value === null || value === void 0 ? void 0 : value.toString()) || "")),
            situation: yup
                .number()
                .typeError("A situação deve ser um número!")
                .required("O campo situação é obrigatório!")
                .integer("O campo situação deve ser um número inteiro!")
                .positive("O campo situação deve ser um valor positivo!"),
            category: yup
                .number()
                .typeError("A categoria deve ser um número!")
                .required("O campo categoria é obrigatório!")
                .integer("O campo categoria deve ser um número inteiro!")
                .positive("O campo categoria deve ser um valor positivo!"),
        });
        //Verifica se os dados passaram pela validação
        yield schema.validate(data, { abortEarly: false });
        //Gera slug automaticamente com base no nome
        data.slug = (0, slugify_1.default)(data.slug, { lower: true, strict: true });
        //Cria uma isntância do repósitorio de Product
        const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
        //const newProduct = productRepository.create(data);
        //await productRepository.save(newProduct); //Isso que irá salvar no banco de dados
        //Recupera o registro do banco de dados com o valor da coluna slug
        const existingProduct = yield productRepository.findOne({
            where: { slug: data.slug }
        });
        //Verifica se já existe um produto com o mesmo slug
        if (existingProduct) {
            res.status(400).json({
                message: "Já existe um produto cadastrado com esse slug"
            });
            return;
        }
        // Criar um novo registro
        const newProduct = productRepository.create(data);
        // Salvar o registro no banco de dados
        yield productRepository.save(newProduct);
        // Retornar resposta de sucesso
        res.status(201).json({
            message: "Produto cadastrado com sucesso!",
            product: newProduct,
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            // Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        //Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao cadastrar produto!",
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
