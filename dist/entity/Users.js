import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Situation } from "./Situation";
@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id;
    @Column()
    name;
    @Column({ unique: true })
    email;
    @ManyToOne(() => Situation, (situation) => situation.users)
    @JoinColumn({ name: "situationId" })
    situation;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt;
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt;
}
