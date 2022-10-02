import { Context } from "koa";
import { Any, getManager } from "typeorm";
import { validate, ValidationError } from "class-validator";
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';

import { User } from "../entity/user";
import { JWT_SECRET } from '../constants';

export default class AuthController {
    public static async login(ctx: Context) {
        const userRepository = getManager().getRepository(User);
        const userFromDB = await userRepository
            .createQueryBuilder()
            .where({ username: ctx.request.body?.username })
            .addSelect('User.password')
            .getOne();

        if (!userFromDB) {
            ctx.status = 401;
            ctx.body = { msg: '用户名不存在' };
        } else if (await argon2.verify(userFromDB.password as string, ctx.request.body?.password as any)) {
            ctx.status = 200;
            ctx.body = {
                msg: "success",
                data: {
                    token: jwt.sign({ id: userFromDB.id }, JWT_SECRET)
                }
            };
        } else {
            ctx.status = 401;
            ctx.body = { msg: '密码错误' };
        }
    }

    public static async register(ctx: Context) {
        const userRepository = getManager().getRepository(User);
        const newUser = new User()

        newUser.username = ctx.request.body?.username as any;
        newUser.password = ctx.request.body?.password as any;

        const errors: ValidationError[] = await validate(newUser);

        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = {
                msg: "校验失败",
                errors: errors.map(item => item.constraints)
            };
        } else if (await userRepository.findOne({ where: { username: newUser.username } } as any)) {
            ctx.status = 400;
            ctx.body = {
                msg: "用户已存在"
            };
        } else {
            newUser.password = await argon2.hash(ctx.request.body?.password as any);
            const user = await userRepository.save(newUser);

            ctx.status = 201;
            ctx.body = {
                msg: "注册成功",
                data: user.id
            };
        }
    }
}