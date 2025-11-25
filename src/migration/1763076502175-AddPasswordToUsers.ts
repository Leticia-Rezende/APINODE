import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPasswordToUsers1763076502175 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: "password",
            type: "varchar",
            isNullable: false,
        }));

        //Ajustar a ordem da coluna
        await queryRunner.query(`ALTER TABLE users MODIFICY COLUMS password varchar(255) AFTER email`)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "password")
    }

}
