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
router.get("/", (req, res) => {
    res.send("Programação com Leticia Auto Controller");
});
//Exportar a instrução da rota
exports.default = router;
//Iniciar o servidor na porta definida na variável de ambiente
//app.listen(8080, () => {
//  console.log("Servidor iniciado na porta 8080: http://localhost:8080")
//})
