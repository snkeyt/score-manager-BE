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
export class User {
    @PrimaryGeneratedColumn()
    id: Number;

    @Length(3, 20)
    @IsNotEmpty()
    @Column()
    username: String;

    @Length(4, 16)
    @IsNotEmpty()
    @Column({ select: false })
    password: String;
}