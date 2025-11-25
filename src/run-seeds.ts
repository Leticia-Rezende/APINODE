import { AppDataSource } from "./data-source"
import CreateSituationSeeds from "./seeds/CreateSituationSeeds";
import CreateProductSituationSeeds from "./seeds/CreateProductSituationSeeds";
import CreateProductCategorySeeds from "./seeds/CreateProductCategorySeeds";
import CreateProductSeeds from "./seeds/CreateProductSeeds";
import CreateUsersSeed from "./seeds/CreateUsersSeed";

const runSeeds = async() =>{
    console.log("Conectando ao banco de dados...")

    await AppDataSource.initialize();
    console.log("Banco de dados conectado! ")

    try{

        // Seed para 'situations' 
        const situationsSeeds =  new CreateSituationSeeds(); 

        //Seed para 'Users'
        const userSeed = new CreateUsersSeed();
        
        // Seed para 'product_situations'
        const productSituationSeeds = new CreateProductSituationSeeds();

        // Seed para 'product_categories'
         const productCategorySeeds = new CreateProductCategorySeeds();
        
        // Seed para 'products'
         const productProductSeeds = new CreateProductSeeds();

        // EXECUTAR AS SEEDS 

        //  Seed para 'situation'
        await  situationsSeeds.run(AppDataSource); 

        //Seed para 'User'
        await userSeed.run(AppDataSource);
        
        // Seed para 'product_situations'
        await productSituationSeeds.run(AppDataSource);

        // Seed para 'product_categories'
        await  productCategorySeeds.run(AppDataSource);
        
        // Seed para 'products'
        await productProductSeeds.run(AppDataSource);

        console.log("Todas as Seeds foram executadas com sucesso!");

    }catch(error){

        console.log("Erro ao executar o seed: ", error);

    }finally{ //Encerra conexão com o banco de dados
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.")
    }
};
runSeeds();