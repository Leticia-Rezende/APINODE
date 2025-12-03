// importar a biblioteca do Express
import express, {Response, Request} from "express"
import { AuthService } from "../services/AuthService";
//Importar a conexão com banco de dados
import { AppDataSource } from "../data-source";
//Importar a entidade
import { User } from "../entity/Users";
//Importar a biblioteca para validar os dados para cadastrar e editar
import * as yup from 'yup';
//Importar a biblioteca para gerar a chave recuperar senha
import crypto from "crypto";

import nodemailer from "nodemailer";
//Importar o middleware de autenticação
import {verifyToken} from "../middlewares/authMiddleware";

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
});

// Criar a rota para validar o token
// Endereço para acessar a api através da aplicação externa com o verbo GET: http://localhost:8080/validate-token
// Enviar o Bearer Token do usuário logado, exemplo: Bearer <colocar-o-token-gerado-com-jwt>
router.get("/validate-token", verifyToken, async(req:Request, res:Response)=>{
  res.status(200).json({
      message: "Token válido!",
      userId: (req as any).user.id,
  });

});

// Criar a rota pública para cadastrar usuário
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/new-users
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "name": "Leticia",
    "email": "leticia@gmail.com.br",
    "password": "123456",
    "situation": 1
}
*/
router.post("/new-users", async (req: Request, res: Response) =>{
    try{
        //Receber os dados enviados no corpo da requisição
        var data = req.body;

        //Validar os dados utilizando o yup
        const schema = yup.object().shape({
            name: yup.string().required("O campo nomé é obrigatório!").min(3, "O campo nome deve ter no minimo 3 caracteres!"),
            email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
            password: yup.string().required("O campo senha é obrigatório!").min(6, "O campo senha deve ter no minimo 3 caracteres!"),
            situation: yup.number().required("O campo situação é obrigatório!"), 
        });

        //Verificar se os dados passaram pela validação
        await schema.validate(data, {abortEarly: false});

        //Criar uma instância do repositório de User
        const userRepository = AppDataSource.getRepository(User);

        //Recuperar o registro do banco de dados com o valor da coluna email
        const existingUser = await userRepository.findOne({
            where: {email: data.email}
        });

        //Verifica se já existe um usuário com o mesmo e-mail
        if(existingUser){
            res.status(400).json({
                message:"Já existe um usuário cadastrado com esse e-mail",
            });
            return;
        }
        //Criptografar a senha antes de salvar
        //data.password = await bcrypt.hash(data.password, 10)

        //Criar um novo registro
        const newUser = userRepository.create(data);

        //Salvar o registro no banco de dados
        await userRepository.save(newUser);

        //Retornar resposta de sucesso
        res.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            situation: newUser,
        });
    } catch (error){
        if (error instanceof yup.ValidationError){
            //Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        //Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao cadastrar usuário!"
        });
    }
});

// Criar a rota para recuperar a senha
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/recover-password
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "urlRecoverPassword": "http://localhost",
    "email": "leticia@gmail.com.br"
}
*/

router.post("/recover-password", async (req:Request, res: Response) => {
  try{
     //Receber os dados enviados no corpo da requisição
      var data = req.body;

        //Validar os dados utilizando o yup
      const schema = yup.object().shape({
          urlRecoverPassword: yup.string().required("A URL é obrigatória!"),
          email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
      });

      //Verificar se os dados passaram pela validação
      await schema.validate(data, {abortEarly: false});

      //Criar uma instância do repositório de User
      const userRepository = AppDataSource.getRepository(User);

      //Recuperar o registro do banco de dados com o valor da coluna email
      const user = await userRepository.findOneBy({email: data.email});

      //Verifica se já existe um usuário com o mesmo e-mail
      if(!user){
          res.status(404).json({
              message:"Usuário não encontrado",
          });
          return;
        }
        //Gera um token seguro de 64 caracteres
        user.recoverPassword = crypto.randomBytes(32).toString("hex");

      //Salvar as alterações no banco de dados
      await userRepository.save(user);

      // Criar a variavél com as credenciais do servidor para enviar e-mail
      const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT),
          secure: false,
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
          }
      });

        //Criar a variavel com o conteúdo do e-mail

      var message_content = {
        from: process.env.EMAIL_FROM,
        to: data.email,
        subject: "Recuperar senha",
        text: `Prezando(a) ${user.name} \n\n
        Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.\n\n
        Clique ou copie o link para criar uma nova senha em nosso sistema:
        ${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}\n\n
        Esta mensagem foi enviada a você pela empresa ${process.env.APP}.\n\n
        Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}.
        Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita
        o preenchimento de senhas e informações cadastrais.\n\n`, // Conteúdo do e-mail somente texto

        html: `Prezando(a) ${user.name} <br><br>
        Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.<br><br>
        Clique ou copie o link para criar uma nova senha em nosso sistema:
        ${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}<br><br>
        Esta mensagem foi enviada a você pela empresa ${process.env.APP}.<br><br>
        Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}.
        Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita
        o preenchimento de senhas e informações cadastrais.<br><br>`, // HTML body
      }

      transporter.sendMail(message_content, function(err){
        if(err){
          console.log("Erro ao enviar email: ", err);
          res.status(200).json({
          message: `E-mail não enviado, tente novamente ou contate ${process.env.EMAIL_ADM}`,
          });
          return;
        }else{
          //Retornar resposta de sucesso
          res.status(200).json({
            message: "Email enviado! Verifique sua caixa de entrada!",
            urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
          });
            return;
          }
        })

  }catch(error: any){
    //Retornar erro em caso de falha
      if (error instanceof yup.ValidationError) {
            // Retornar erros de validação
            res.status(400).json({
             message: error.errors
            });
            return;
        }
        // Retornar erro em caso de falha
        res.status(500).json({
          message: "Erro ao recuperar a senha do usuário!",
        });
      }

});

// Criar a rota para validar a chave recuperar a senha
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/validate-recover-password
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "recoverPassword": "chave-recuperar-senha",
    "email": "leticia@gmail.com.br"
}
*/

router.post("/validate-recover-password", async (req:Request, res: Response) => {
  try{
     //Receber os dados enviados no corpo da requisição
      var data = req.body;

        //Validar os dados utilizando o yup
      const schema = yup.object().shape({
          recoverPassword: yup.string().required("A chave é obrigatória!"),
          email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
      });

      //Verificar se os dados passaram pela validação
      await schema.validate(data, {abortEarly: false});

      //Criar uma instância do repositório de User
      const userRepository = AppDataSource.getRepository(User);

      //Recuperar o registro do banco de dados com o valor da coluna email
      const user = await userRepository.findOneBy({email: data.email, recoverPassword: data.recoverPassword});

      //Verifica se já existe um usuário com o mesmo e-mail
      if(!user){
          res.status(404).json({
              message:"A chave recuper senha é inválida!",
          });
          return;
        }

        res.status(200).json({
            message: "A chave recuper senha é válida!",
        });
        return;

      }catch(error: any){
    //Retornar erro em caso de falha
      if (error instanceof yup.ValidationError) {
            // Retornar erros de validação
            res.status(400).json({
             message: error.errors
            });
            return;
        }
        // Retornar erro em caso de falha
        res.status(500).json({
          message:"A chave recuper senha é inválida!",
        });
      }
      
});

// Criar a rota para atualizar a senha
// Endereço para acessar a api através da aplicação externa com o verbo POST: http://localhost:8080/update-password
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "recoverPassword": "chave-recuperar-senha",
    "email": "leticia@gmail.com.br",
    "password": "123456"
}
*/

router.put("/update-password", async (req:Request, res: Response) => {
  try{
    //Receber os dados enviados no corpo da requisição
      var data = req.body;

        //Validar os dados utilizando o yup
      const schema = yup.object().shape({
          recoverPassword: yup.string().required("A chave é obrigatória!"),
          email: yup.string().email("E-mail inválido!").required("O campo e-mail é obrigatório!"),
           password: yup.string().required("O campo senha é obrigatório!").min(6, "O campo senha deve ter no minimo 3 caracteres!"),
      });

      //Verificar se os dados passaram pela validação
      await schema.validate(data, {abortEarly: false});

      //Criar uma instância do repositório de User
      const userRepository = AppDataSource.getRepository(User);

      //Recuperar o registro do banco de dados com o valor da coluna email
      const user = await userRepository.findOneBy({email: data.email, recoverPassword: data.recoverPassword});

      //Verifica se já existe um usuário com o mesmo e-mail
      if(!user){
          res.status(404).json({
              message:"A chave recuper senha é inválida!",
          });
          return;
        }

        //Atribuir valor nulo para a coluna recoverPassword
        data.recoverPassword = null;

        //Atualizar os dados do usuário
        userRepository.merge(user, data);

        //Salvar as alterações no banco de dados
        await userRepository.save(user);

        res.status(200).json({
            message: "Senha atualizada com sucesso!",
        });
        return;


      }catch(error: any){
    //Retornar erro em caso de falha
      if (error instanceof yup.ValidationError) {
            // Retornar erros de validação
            res.status(400).json({
             message: error.errors
            });
            return;
        }
        // Retornar erro em caso de falha
        res.status(500).json({
          message:"A chave recuper senha é inválida!",
        });
      }
      
});

//Exportar a instrução da rota
export default router



//Iniciar o servidor na porta definida na variável de ambiente
//app.listen(8080, () => {
  //  console.log("Servidor iniciado na porta 8080: http://localhost:8080")
//})