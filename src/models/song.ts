import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./user";

@Entity()
export class Song extends BaseEntity {
    @PrimaryGeneratedColumn()
    song_id: number;

    @Column()
    judul: string;

    @Column()
    penyanyi_id: number;

    @Column()
    audio_path: string;

    @ManyToOne(() => User, (user) => user.user_id, { cascade: true })
    @JoinColumn({ name: "penyanyi_id" })
    user: User;
}
