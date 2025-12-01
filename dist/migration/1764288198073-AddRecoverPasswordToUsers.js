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
exports.AddRecoverPasswordToUsers1764288198073 = void 0;
const typeorm_1 = require("typeorm");
class AddRecoverPasswordToUsers1764288198073 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn('users', new typeorm_1.TableColumn({
                name: "recoverPassword",
                type: "varchar",
                isUnique: true,
                isNullable: true,
            }));
            //Ajustar a ordem do coluna
            yield queryRunner.query(`ALTER TABLE users MODIFY COLUMN recoverPassword varchar(255) AFTER password`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn("users", "recoverPassword");
        });
    }
}
exports.AddRecoverPasswordToUsers1764288198073 = AddRecoverPasswordToUsers1764288198073;
