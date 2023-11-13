import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nick: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: false })
    senha: string;

    @Column()
    points: number;
}
