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
const ProductCategory_1 = require("../entity/ProductCategory");
class CreateProductCategorySeeds {
    run(dataSource) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Iniciando o seed para a tabela 'product_categories'...");
            const categoryRepository = dataSource.getRepository(ProductCategory_1.ProductCategory);
            const existingCount = yield categoryRepository.count();
            if (existingCount > 0) {
                console.log("A tabela 'product_categories' já possui dados. Nenhuma alteração foi realizada.");
                return;
            }
            const categoriesProductCategories = [
                { nameProductCategory: "Eletrônicos" },
                { nameProductCategory: "Vestuário" },
                { nameProductCategory: "Livros" },
                { nameProductCategory: "Alimentos" },
            ];
            // Salva o array de objetos JSON diretamente
            yield categoryRepository.save(categoriesProductCategories);
            console.log("Seed concluído com sucesso: categorias de produto cadastradas!");
        });
    }
}
exports.default = CreateProductCategorySeeds;
