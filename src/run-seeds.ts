import { AppDataSource } from "./data-source"
import CreateSituationSeeds from "./seeds/CreateSituationSeeds";
import CreateProductSituationSeeds from "./seeds/CreateProductSituationSeeds";
import CreateProductCategorySeeds from "./seeds/CreateProductCategorySeeds";
import CreateProductSeeds from "./seeds/CreateProductSeeds";

const runSeeds = async() =>{
    console.log("Conectando ao banco de dados...")

    await AppDataSource.initialize();
    console.log("Banco de dados conectado! ")

    try{
        await AppDataSource.initialize();
        console.log("Banco de dados conectado! ")

        
        // Seed para 'situations' 
        await new CreateSituationSeeds().run(AppDataSource); 
        
        // Seed para 'product_situations'
        await new CreateProductSituationSeeds().run(AppDataSource);

        // Seed para 'product_categories'
        await new CreateProductCategorySeeds().run(AppDataSource);
        
        // Seed para 'products'
        await new CreateProductSeeds().run(AppDataSource);

        console.log("Todas as Seeds foram executadas com sucesso!");

    }catch(error){

        console.log("Erro ao executar o seed: ", error);

    }finally{ //Encerra conexão com o banco de dados
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.")
    }
};
runSeeds();