import { AppDataSource } from "./data-source"
import CreateSituationSeeds from "./seeds/CreateSituationSeeds";

const runSeeds = async() =>{
    console.log("Conectando ao banco de dados...")

    await AppDataSource.initialize();
    console.log("Banoc de dados conectado! ")

    try{
        //Cria a isntancia da classe de Seed
        const situatiosSeeds = new CreateSituationSeeds();
        
        //Executa as Seeds
        await situatiosSeeds.run(AppDataSource);

    }catch(error){

        console.log("Erro ao executar o seed: ", error);

    }finally{ //Encerra conexão com o banco de dados
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.")
    }
};
runSeeds();