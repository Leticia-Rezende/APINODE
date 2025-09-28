"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = require("../entity/Product");
const ProductSituation_1 = require("../entity/ProductSituation");
const ProductCategory_1 = require("../entity/ProductCategory");
class CreateProductSeeds {
    run(dataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Iniciando o seed para a tabela 'products'...");
            const productRepository = dataSource.getRepository(Product_1.Product);
            const existingCount = yield productRepository.count();
            if (existingCount > 0) {
                console.log("A tabela 'products' já possui dados. Nenhuma alteração foi realizada.");
                return;
            }
            // Busca IDs de referência 
            const situationRepository = dataSource.getRepository(ProductSituation_1.ProductSituation);
            const categoryRepository = dataSource.getRepository(ProductCategory_1.ProductCategory);
            // Busca a situação "Ativo" e a categoria "Eletrônicos" para usar os IDs
            const activeSituation = yield situationRepository.findOneBy({ nameProductSituation: "Ativo" });
            const electronicsCategory = yield categoryRepository.findOneBy({ nameProductCategory: "Eletrônicos" });
            if (!activeSituation || !electronicsCategory) {
                console.error("ERRO: Não foi possível encontrar as referências 'Ativo' ou 'Eletrônicos'. Execute as Seeds de catálogo primeiro!");
                return;
            }
            const products = [
                {
                    nameProduct: "Smartphone Ulta",
                    productSituationId: activeSituation.id,
                    productCategoryId: electronicsCategory.id
                },
                {
                    nameProduct: "PC Gamer Pro",
                    productSituationId: activeSituation.id,
                    productCategoryId: electronicsCategory.id
                },
                {
                    nameProduct: "Tela Portatil",
                    productSituationId: activeSituation.id,
                    productCategoryId: electronicsCategory.id
                },
            ];
            //Salvar o array de objetos JSON diretamente
            yield productRepository.save(products);
            console.log(`Seed concluído com sucesso: ${products.length} produtos cadastrados.`);
        });
    }
}
exports.default = CreateProductSeeds;
