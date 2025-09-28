import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToMany, ManyToOne } from "typeorm"
import { ProductSituation } from "./ProductSituation";
import { ProductCategory } from "./ProductCategory";
import { Situation } from "./Situation";

@Entity("products")
export class Product {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({length: 255})
    nameProduct!: string;

    @Column({ name: 'productSituationId' }) // <-- Indica ao TypeORM que esta é a coluna física no BD
    productSituationId!: number;

    //Relacionamento N : 1 Products --> product_situation
    @ManyToOne(() => ProductSituation) 
    @JoinColumn ({name: 'productSituationId'})
    situation!: ProductSituation;

    @Column({ name: 'productCategoryId' }) // <-- Indica ao TypeORM que esta é a coluna física no BD
    productCategoryId!: number;

    //Relacionamento N : 1 Products --> product_category
    @ManyToOne(() => ProductCategory) 
    @JoinColumn ({name: 'productCategoryId'})
    category!: ProductCategory;

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

}