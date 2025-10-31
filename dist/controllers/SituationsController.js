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
const Situation_1 = require("../entity/Situation");
const PaginationServices_1 = require("../services/PaginationServices");
const yup = __importStar(require("yup"));
//Criar a aplicação Express
const router = express_1.default.Router();
// Criar a Lista
router.get("/situations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Obter o repositório da entidade Situation
        const situationRepository = data_source_1.AppDataSource.getRepository(Situation_1.Situation);
        //Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;
        //Definir o limite de registros por página
        const limite = Number(req.query.limite) || 10;
        // Serviço de Paginação
        const result = yield PaginationServices_1.PaginationService.paginate(situationRepository, page, limite, { id: "DESC" });
        //Retornar a resposta com os dados e informações da paginação
        res.status(200).json(result); //Lista todos os dados do banco
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao Listar a situação!",
        });
        return;
    }
}));
// Criar a Visualização do item cadastrado em situação
router.get("/situations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const situationRepository = data_source_1.AppDataSource.getRepository(Situation_1.Situation);
        const situation = yield situationRepository.findOneBy({ id: parseInt(id) });
        if (!situation) {
            res.status(404).json({
                message: "Situação não encontrada!",
            });
            return;
        }
        res.status(200).json(situation); //Lista todos os dados do banco
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao Visualizar a situação!",
        });
        return;
    }
}));
// Cadastra item no banco de dados
router.post("/situations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var data = req.body;
        const schema = yup.object().shape({
            nameSituation: yup.string()
                .required("O campo nome é obrigatório!") //Mensagem se dê erro
                .min(3, "O campo deve ter no minímo 3 caracteres!") //Qauntidade de caracteres
        });
        yield schema.validate(data, { abortEarly: false });
        const situationRepository = data_source_1.AppDataSource.getRepository(Situation_1.Situation);
        const newSituation = situationRepository.create(data);
        yield situationRepository.save(newSituation); //Isso que irá salvar no banco de dados
        res.status(201).json({
            message: "Situação cadastrada com sucesso!",
            situation: newSituation,
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        res.status(500).json({
            message: "Erro ao cadastrar a situação!",
        });
    }
}));
// Faz a atualização do item cadastrado 
router.put("/situations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        var data = req.body;
        const schema = yup.object().shape({
            nameSituation: yup.string()
                .required("O campo nome é obrigatório!") //Mensagem se dê erro
                .min(3, "O campo deve ter no minímo 3 caracteres!") //Qauntidade de caracteres
        });
        yield schema.validate(data, { abortEarly: false });
        const situationRepository = data_source_1.AppDataSource.getRepository(Situation_1.Situation);
        const situation = yield situationRepository.findOneBy({ id: parseInt(id) }); //Busca pelo ID digitado
        if (!situation) { //Se passar um ID que não exite ele passa a seguinte mensagem
            res.status(404).json({
                message: "Situação não encontrada!",
            });
            return;
        }
        //Atualiza os dados
        situationRepository.merge(situation, data);
        //Salvar as alterações de dados
        const updateSituation = yield situationRepository.save(situation);
        res.status(200).json({
            messagem: "Situação atualizada com sucesso!",
            situation: updateSituation,
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        res.status(500).json({
            message: "Erro ao Atualizar a situação!",
        });
    }
}));
// Remove o item cadastrado no banco de dados
router.delete("/situations/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const situationRepository = data_source_1.AppDataSource.getRepository(Situation_1.Situation);
        const situation = yield situationRepository.findOneBy({ id: parseInt(id) }); //Busca pelo ID digitado
        if (!situation) { //Se passar um ID que não exite ele passa a seguinte mensagem
            res.status(404).json({
                message: "Situação não encontrada!",
            });
            return;
        }
        //Remove os dados no banco
        yield situationRepository.remove(situation);
        res.status(200).json({
            messagem: "Situação foi removida com sucesso!",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao Atualizar a situação!",
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
