import { Context } from "koa";
import { getManager } from "typeorm";

import { Score } from "../entity/score";

export default class ScoreController {
    public static async listScore(ctx: Context) {
        const ScoreRepository = getManager().getRepository(Score)
        const scores = await ScoreRepository.find({
            where: {
                studentName: ctx.request.body?.studentName as any,
                idNum: ctx.request.body?.idNum as any,
            }
        })

        ctx.status = 200;
        ctx.body = {
            msg: "操作成功 ",
            data: scores
        };
    }

    public static async updateScore(ctx: Context) {
        const ScoreRepository = getManager().getRepository(Score)
        const newRecord = { ...ctx.request.body }
        const scores = await ScoreRepository.update(ctx.request.body?.id as any, newRecord)

        ctx.status = 200;
        ctx.body = {
            msg: "操作成功",
            data: scores
        };
    }

    public static async addScore(ctx: Context) {
        const ScoreRepository = getManager().getRepository(Score)
        const score = new Score()
        Object.assign(score, ctx.request.body)
        const ret = await ScoreRepository.save(score)

        ctx.status = 200;
        ctx.body = {
            msg: "操作成功",
            data: ret
        };
    }
    public static async delScore(ctx: Context) {
        const ScoreRepository = getManager().getRepository(Score)
        const ret = await ScoreRepository.save(ctx.request.body?.id as any)

        ctx.status = 200;
        ctx.body = {
            msg: "操作成功",
            data: ret
        };
    }
}