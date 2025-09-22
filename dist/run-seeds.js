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
const data_source_1 = require("./data-source");
const CreateSituationSeeds_1 = __importDefault(require("./seeds/CreateSituationSeeds"));
const runSeeds = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Conectando ao banco de dados...");
    yield data_source_1.AppDataSource.initialize();
    console.log("Banoc de dados conectado! ");
    try {
        //Cria a isntancia da classe de Seed
        const situatiosSeeds = new CreateSituationSeeds_1.default();
        //Executa as Seeds
        yield situatiosSeeds.run(data_source_1.AppDataSource);
    }
    catch (error) {
        console.log("Erro ao executar o seed: ", error);
    }
    finally { //Encerra conexão com o banco de dados
        yield data_source_1.AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.");
    }
});
runSeeds();
