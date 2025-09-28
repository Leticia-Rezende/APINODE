"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const ProductSituation_1 = require("./ProductSituation");
const ProductCategory_1 = require("./ProductCategory");
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Product.prototype, "nameProduct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'productSituationId' }) // <-- Indica ao TypeORM que esta é a coluna física no BD
    ,
    __metadata("design:type", Number)
], Product.prototype, "productSituationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductSituation_1.ProductSituation),
    (0, typeorm_1.JoinColumn)({ name: 'productSituationId' }),
    __metadata("design:type", ProductSituation_1.ProductSituation)
], Product.prototype, "situation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'productCategoryId' }) // <-- Indica ao TypeORM que esta é a coluna física no BD
    ,
    __metadata("design:type", Number)
], Product.prototype, "productCategoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductCategory_1.ProductCategory),
    (0, typeorm_1.JoinColumn)({ name: 'productCategoryId' }),
    __metadata("design:type", ProductCategory_1.ProductCategory)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)("products")
], Product);
