import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSlugToProductsts1763076478463 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn ('products', new TableColumn({
            name: "slug",
            type: "varchar",
            isUnique: true,
            isNullable: false,
        }));
        

        // O comando correto é MODIFY COLUMN
        await queryRunner.query('ALTER TABLE products MODIFY COLUMN slug varchar(255) AFTER nameProduct');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "slug");
    }

}

