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
    title: string;

    @Column()
    penyanyiID: number;

    @Column()
    audioPath: string;

    @Column()
    duration: number;

    @ManyToOne(() => User, (user) => user.userID, { cascade: true })
    @JoinColumn({ name: "penyanyiID" })
    user: User;
}
