import { MigrationInterface, QueryRunner, Table } from "typeorm";
export class CreateSituationsTable1757013275523 {
    async up(queryRunner) {
        await queryRunner.createTable(new Table({
            name: "situations",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                }, {
                    name: "nameSituation",
                    type: "varchar"
                }, {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }, {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("situations");
    }
}
