import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm"
import { Situation } from "./Situation";
import bcrypt from "bcryptjs";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({unique: true})
    email!: string;

    @Column()
    password!: string;

    @Column({unique: true})
    recoverPassword!: string;

    @ManyToOne(() => Situation, (situation) => situation.users) 
    @JoinColumn ({name: "situationId"})
    situation!: Situation;

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void>{
        if(this.password){
            this.password = await bcrypt.hash(this.password,10)
        }
    }

    //metodo para comparar a senha informada pelo usuário com a senha amarzenada no banco de dados
    async comparePassword(password: string): Promise<boolean>{
        return bcrypt.compare(password, this.password)
    }
}