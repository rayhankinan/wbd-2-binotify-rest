import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./user-model";

@Entity()
export class Song extends BaseEntity {
    @PrimaryGeneratedColumn()
    songID: number;

    @Column()
    judul: string;

    @Column()
    penyanyiID: number;

    @Column()
    audioPath: string;

    @ManyToOne(() => User, (user) => user.userID, { cascade: true })
    @JoinColumn({ name: "penyanyiID" })
    user: User;
}
