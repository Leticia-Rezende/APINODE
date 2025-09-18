// importar a biblioteca do Express
import express, {Response, Request} from "express"


//Criar a aplicação Express
const router = express.Router();


// Criar a rota GET principal
router.get("/",(req:Request, res:Response)=>{
    res.send("Programação com Leticia Auto Controller")
})

//Exportar a instrução da rota

export default router



//Iniciar o servidor na porta definida na variável de ambiente
//app.listen(8080, () => {
  //  console.log("Servidor iniciado na porta 8080: http://localhost:8080")
//})