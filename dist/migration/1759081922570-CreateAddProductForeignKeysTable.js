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
exports.AddProductForeignKeys1759081550000 = void 0;
const typeorm_1 = require("typeorm");
class AddProductForeignKeys1759081550000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Adiciona a FK para Situation
            yield queryRunner.createForeignKey("products", new typeorm_1.TableForeignKey({
                columnNames: ["productSituationId"],
                referencedTableName: "product_situations",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
            // Adiciona a FK para Category
            yield queryRunner.createForeignKey("products", new typeorm_1.TableForeignKey({
                columnNames: ["productCategoryId"],
                referencedTableName: "product_categories",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("products");
            const foreignKey1 = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.includes("productSituationId"));
            const foreignKey2 = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.includes("productCategoryId"));
            if (foreignKey1) {
                yield queryRunner.dropForeignKey("products", foreignKey1);
            }
            if (foreignKey2) {
                yield queryRunner.dropForeignKey("products", foreignKey2);
            }
        });
    }
}
exports.AddProductForeignKeys1759081550000 = AddProductForeignKeys1759081550000;
