import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'entities' })

export class Entities {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ nullable: false })
    type: string;

    @Column({ nullable: false })
    height: number;

    @Column({ nullable: false })
    width: number;

    @Column({ nullable: false })
    category: string;
}
