import { Context } from "koa";
import { getManager } from "typeorm";

import { User } from "../entity/user";

export default class UserController {
    public static async listUsers(ctx: Context) {
        const UserRepository = getManager().getRepository(User)
        const users = await UserRepository.find()

        ctx.status = 200;
        ctx.body = users;
    }

    public static async showUserDetail(ctx: Context) {
        const UserRepository = getManager().getRepository(User)
        const user = await UserRepository.findOne(ctx.params.id)

        if (user) {
            ctx.status = 200;
            ctx.body = user;
            return
        }
        ctx.status = 404;
    }

    public static async updateUser(ctx: Context) {
        const UserRepository = getManager().getRepository(User)
        await UserRepository.update(+ctx.params.id, ctx.request.body as any)
        const user = await UserRepository.findOne(ctx.params.id)

        if (user) {
            ctx.status = 200;
            ctx.body = user;
            return
        }
        ctx.status = 404;
    }

    public static async deleteUser(ctx: Context) {
        const userRepository = getManager().getRepository(User);
        await userRepository.delete(+ctx.params.id);

        ctx.status = 204;
    }
}