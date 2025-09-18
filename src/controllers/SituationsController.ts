// importar a biblioteca do Express
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situation";


//Criar a aplicação Express
const router = express.Router();


// Criar a rota GET principal
router.get("/situations",(req:Request, res:Response)=>{
    res.send("Programação com Leticia Situações")
});

// Criar a rota Post principal
router.post("/situations",async(req:Request, res:Response)=>{

    try{
      var data = req.body;

      const situationRepository = AppDataSource.getRepository(Situation)
      const newSituation = situationRepository.create(data);

      await situationRepository.save(newSituation); //Isso que irá salvar no banco de dados

      res.status(201).json({
        message : "Situação cadastrada com sucesso!",
        situation: newSituation,
      });

    }catch(error){

       res.status(500).json({
        message : "Erro ao cadastrar a situação!",
      });

    }
});


//Exportar a instrução da rota
export default router



//Iniciar o servidor na porta definida na variável de ambiente
//app.listen(8080, () => {
  //  console.log("Servidor iniciado na porta 8080: http://localhost:8080")
//})