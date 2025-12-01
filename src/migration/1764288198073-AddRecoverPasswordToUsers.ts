import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRecoverPasswordToUsers1764288198073 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: "recoverPassword",
            type: "varchar",
            isUnique: true,
            isNullable: true,
        }));

        //Ajustar a ordem do coluna
        await queryRunner.query(`ALTER TABLE users MODIFY COLUMN recoverPassword varchar(255) AFTER password`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users","recoverPassword")
    }

}
