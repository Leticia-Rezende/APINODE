import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany } from "typeorm";
import { User } from "./Users";
@Entity("situations")
export class Situation {
    @PrimaryGeneratedColumn()
    id;
    @Column()
    nameSituation;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt;
    @OneToMany(() => User, (user) => user.situation) //Relacionamento de 1 : N
    users;
}
