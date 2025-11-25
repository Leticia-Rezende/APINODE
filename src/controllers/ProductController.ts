// importar a biblioteca do Express
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { PaginationService } from "../services/PaginationServices"; //Confirmar se posso usar a mesma pagina Service
import { scheduler } from "timers/promises";
import { abort } from "process";
import { strict } from "assert";
import * as yup from 'yup';
import slugify from 'slugify' ;



//Criar a aplicação Express
const router = express.Router();


// Criar a Lista
router.get("/products",async(req:Request, res:Response)=>{
  try{

    //Obter o repositório da entidade Product
    const productRepository = AppDataSource.getRepository(Product);

    //Receber o número da página e definir página 1 como padrão
    const page = Number(req.query.page) || 1;

    //Definir o limite de registros por página
    const limite = Number(req.query.limite) || 10;


    // Serviço de Paginação
    const result = await PaginationService.paginate(productRepository, page, limite, {id: "DESC"});

    //Retornar a resposta com os dados e informações da paginação
    res.status(200).json(result); //Lista todos os dados do banco
    return

  }catch(error){
    res.status(500).json({
        message : "Erro ao Listar os produtos!",
      });
      return
  }
});

// Criar a Visualização do item cadastrado em situação
router.get("/products/:id",async(req:Request, res:Response)=>{
  try{

    const {id} = req.params;

    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOneBy({id : parseInt(id)})

    if(!product){
      res.status(404).json({
        message : "Produto não encontrada!",
      });
      return
    }

    res.status(200).json(product); //Lista todos os dados do banco
    return

  }catch(error){
    res.status(500).json({
        message : "Erro ao Visualizar os produtos!",
      });
      return
  }
});

// Cadastra item no banco de dados
router.post("/products",async(req:Request, res:Response)=>{

    try{
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
            .test(
                 "is-decimal",
                  "O preço deve ter no máximo duas casas decimais!",
                  (value) => /^\d+(\.\d{1,2})?$/.test(value?.toString() || "")
            ),

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
      await schema.validate(data, {abortEarly: false});

      //Gera slug automaticamente com base no nome
      data.slug = slugify(data.slug, {lower: true, strict: true});

      //Cria uma isntância do repósitorio de Product
      const productRepository = AppDataSource.getRepository(Product)

      //const newProduct = productRepository.create(data);

      //await productRepository.save(newProduct); //Isso que irá salvar no banco de dados

      //Recupera o registro do banco de dados com o valor da coluna slug
      const existingProduct = await productRepository.findOne({
        where: {slug: data.slug}
      });

      //Verifica se já existe um produto com o mesmo slug
      if (existingProduct){
        res.status(400).json({
          message: "Já existe um produto cadastrado com esse slug"
        });
        return;
      }

      // Criar um novo registro
      const newProduct = productRepository.create(data);

      // Salvar o registro no banco de dados
      await productRepository.save(newProduct);

      // Retornar resposta de sucesso
      res.status(201).json({
        message: "Produto cadastrado com sucesso!",
        product: newProduct,
    });
  } catch (error) {
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
});


// Faz a atualização do item cadastrado 
router.put("/products/:id",async(req:Request, res:Response)=>{
  try{

    const {id} = req.params;

    var data = req.body;

    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOneBy({id : parseInt(id)}) //Busca pelo ID digitado

    if(!product){ //Se passar um ID que não exite ele passa a seguinte mensagem
      res.status(404).json({
        message : "Produto não encontrada!",
      });
      return
    }

    //Atualiza os dados
    productRepository.merge(product, data);

    //Salvar as alterações de dados
    const updateProduct = await productRepository.save(product);

    res.status(200).json({
      messagem: "Produto atualizado com sucesso!",
      product: updateProduct,
    }); 
    

  }catch(error){
    res.status(500).json({
        message : "Erro ao Atualizar o produto!",
      });
      return
  }
});

// Remove o item cadastrado no banco de dados
router.delete("/products/:id",async(req:Request, res:Response)=>{
  try{

    const {id} = req.params;

    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOneBy({id : parseInt(id)}) //Busca pelo ID digitado

    if(!product){ //Se passar um ID que não exite ele passa a seguinte mensagem
      res.status(404).json({
        message : "Produto não encontrado!",
      });
      return
    }

    //Remove os dados no banco
    await productRepository.remove(product);

    res.status(200).json({
      messagem: "Produto foi removido com sucesso!",
    }); 
    

  }catch(error){
    res.status(500).json({
        message : "Erro ao Atualizar o produto!",
      });
      return
  }
});


//Exportar a instrução da rota
export default router