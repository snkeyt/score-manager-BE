import { Context } from "koa";
import { Any, getManager } from "typeorm";
import { validate, ValidationError } from "class-validator";

import { User } from "../entity/user";

export default class AuthController {
    public static async login(ctx: Context) {
        ctx.body = 'login'
    }
    public static async register(ctx: Context) {
        const userRepository = getManager().getRepository(User);
        const newUser = new User()

        newUser.name = ctx.request.body?.name as any;
        newUser.password = ctx.request.body?.password as any;

        const errors: ValidationError[] = await validate(newUser);

        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = {
                msg: "校验失败",
                errors: errors.map(item => item.constraints)
            };
        } else if (await userRepository.findOne({ where: { name: newUser.name } } as any)) {
            ctx.status = 400;
            ctx.body = {
                msg: "用户已存在"
            };
        } else {
            const user = await userRepository.save(newUser);

            ctx.status = 201;
            ctx.body = {
                msg: "注册成功",
                data: user.id
            };
        }
    }
}