"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importar a biblioteca do Express
const express_1 = __importDefault(require("express"));
//Criar a aplicação Express
const router = express_1.default.Router();
// Criar a rota GET principal
router.get("/test-connection", (req, res) => {
    res.status(200).json({ message: "Conexão com  API realizada com sucesso!" });
});
//Exportar a instrução da rota
exports.default = router;
