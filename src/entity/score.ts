import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, Unique } from "typeorm";
import {
    validate,
    validateOrReject,
    Contains,
    IsInt,
    Length,
    IsEmail,
    IsFQDN,
    IsDate,
    Min,
    Max,
    IsNotEmpty,
} from 'class-validator';

@Entity()
@Unique("UQ_SCORE", ["studentName", "idNum", "date", "subjectName", "level"])
export class Score {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column({
        nullable: true,
        default: '',
        type: "varchar",
        length: 50,
    })
    institutionName: String;

    @Column({
        nullable: true,
        default: '',
        type: "varchar",
        length: 20,
    })
    studentName: String;

    @Column({
        nullable: true,
        default: '',
        type: "varchar",
        length: 20,
    })
    idType: String;

    @Column({
        nullable: true,
        default: '',
        type: "varchar",
        length: 20,
    })
    idNum: String;

    @Column({
        nullable: true,
        default: '',
        type: "varchar",
        length: 20,
    })
    date: String;

    @Column({
        nullable: true,
        default: '',
        type: "varchar",
        length: 50,
    })
    subjectName: String;

    @Column({
        nullable: true,
        default: '',
        type: "varchar",
        length: 20,
    })
    level: String;

    @Column({
        nullable: true,
        default: '',
        type: "varchar",
        length: 20,
    })
    score: String;
}