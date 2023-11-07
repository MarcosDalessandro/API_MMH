import { truncate } from "fs";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user' })

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nick: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: false })
    senha: string;

    @Column({ nullable: false })
    points: number;
}
