import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSlugToProductsts1763076478463 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn ('products', new TableColumn({
            name: "slug",
            type: "varchar",
            isUnique: true,
            isNullable: false,
        }));

        //Ajustar a ordem sa coluna
        await queryRunner.query(`ALTER TABLE products MODIFICY COLUMS slug varchar(255) AFTER name`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "slug");
    }

}

