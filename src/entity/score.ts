import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
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
export class Score {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column({
        nullable: true,
        default: ''
    })
    institutionName: String;

    @Column({
        nullable: true,
        default: ''
    })
    studentName: String;

    @Column({
        nullable: true,
        default: ''
    })
    idType: String;

    @Column({
        nullable: true,
        default: ''
    })
    idNum: String;

    @Column({
        nullable: true,
        default: ''
    })
    date: String;

    @Column({
        nullable: true,
        default: ''
    })
    subjectName: String;

    @Column({
        nullable: true,
        default: ''
    })
    level: String;

    @Column({
        nullable: true,
        default: ''
    })
    score: String;
}