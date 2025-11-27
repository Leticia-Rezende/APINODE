// importar a biblioteca do Express
import express, {Response, Request} from "express"
import { AuthService } from "../services/AuthService";


//Criar a aplicação Express
const router = express.Router();

// Criar a rota para realizar o login
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "email": "baiao@baiao.com.br",
    "password": "123456"
}
*/

// Criar a rota POST principal
router.post("/", async(req:Request, res:Response)=>{
    try{
      //Extrair "email" e "senha" do corpo da requisição
      const {email, password} = req.body;

      //Verifica sse "email" e "password" foram fornecidos
      if(!email || !password){
        res.status(400).json({
            message: "Email e senha são obrigatórios!"
        });
        return;
      }

      //Criar uma instância do seriço de autenticação
      const authService = new AuthService();

      //Chamar o método "login" para validar as credenciais e obter os dados do usuário
      const userData = await authService.login(email, password)
     
        res.status(200).json({
            message: "Login realizado com sucesso!",
            user: userData
        });
        return;

    }catch(error: any){
      //Retornar erro em caso de falha
        res.status(401).json({
            message: error.message || "Erro ao realizar o login!"
        });
        return;
    }
})

//Exportar a instrução da rota

export default router



//Iniciar o servidor na porta definida na variável de ambiente
//app.listen(8080, () => {
  //  console.log("Servidor iniciado na porta 8080: http://localhost:8080")
//})