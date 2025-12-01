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
exports.AddSlugToProductsts1763076478463 = void 0;
const typeorm_1 = require("typeorm");
class AddSlugToProductsts1763076478463 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn('products', new typeorm_1.TableColumn({
                name: "slug",
                type: "varchar",
                isUnique: true,
                isNullable: false,
            }));
            // O comando correto é MODIFY COLUMN
            yield queryRunner.query('ALTER TABLE products MODIFY COLUMN slug varchar(255) AFTER nameProduct');
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn("products", "slug");
        });
    }
}
exports.AddSlugToProductsts1763076478463 = AddSlugToProductsts1763076478463;
