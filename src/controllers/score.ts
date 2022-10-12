import { Context } from "koa";
import { createQueryBuilder, getManager, SelectQueryBuilder } from "typeorm";
const xlsx = require("node-xlsx")
import path from 'path';

import { Score } from "../entity/score";

export default class ScoreController {
    public static async listScore(ctx: Context) {
        try {
            const ScoreRepository = getManager().getRepository(Score)
            const tab = "score"
            const scoreQueryer = ScoreRepository.createQueryBuilder(tab)//.select(`${tab}.studentName`)
            const params = (ctx.request.body?.params || {}) as any
            const pageParam = (ctx.request.body?.pageParam || {}) as any
            const scores = Object.keys(params).reduce((QB: SelectQueryBuilder<Score>, currParam: string) => {
                return QB.andWhere(`${tab}.${currParam} LIKE :${currParam}`, { [currParam]: `%${params[currParam]}%` })
            }, scoreQueryer)
            if (pageParam.pageSize && pageParam.current) {
                scores.skip(pageParam.pageSize * (pageParam.current - 1))
                    .take(pageParam.pageSize)
            }
            const res1 = scores.getQueryAndParameters()
            const res2 = scores.getQuery()
            const res = await scores.orderBy(`${tab}.id`, "ASC").getMany()

            ctx.status = 200;
            ctx.body = {
                msg: "操作成功",
                data: res
            };
        } catch (error) {
            ctx.status = 200;
            ctx.body = {
                msg: error,
            };
        }
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
        try {
            const ret = await getManager().getRepository(Score)
                .createQueryBuilder()
                .delete()
                .from(Score)
                .where("id = :id", { id: ctx.params.id })
                .execute()

            ctx.status = 200;
            ctx.body = {
                msg: "操作成功",
                data: ret
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                msg: error,
            };
        }

    }
    public static async uploadExcel(ctx: Context) {
        try {
            const filePath = ctx.request.files.file.filepath
            const fileName = ctx.request.files.file.originalFilename
            const newFileName = ctx.request.files.file.newFilename

            // const getRes = await uploadExcelSrv.getExcelObjs(ctx);

            const downPath = path.resolve(__dirname, `../public/uploads/${newFileName}`);
            // 读取xlsx，此处可以按照需求更改自己要读的表格
            const sheets = xlsx.parse(downPath)
            // 读取xlxs的sheet1 
            const sheetData = sheets[0].data.slice(1, -1)
            const keys = [
                'institutionName',
                'studentName',
                'idType',
                'idNum',
                'date',
                'subjectName',
                'level',
                'score',
            ]
            const insertData = sheetData.map((itemArr: Array<String>) => {
                const tmp = {}
                itemArr = itemArr.splice(1) // 去除序号列
                keys.forEach((key, index) => {
                    tmp[key] = itemArr[index]
                })
                return tmp
            })
            try {
                const ret = await getManager().getRepository(Score)
                    .createQueryBuilder()
                    .insert()
                    .into("score")
                    .values(insertData)
                    // .updateEntity(false)
                    .execute();
            } catch (error) {
                let msg = "数据库错误"
                if (error.code === 'ER_DUP_ENTRY') {
                    msg = `数据重复：【${JSON.stringify(error.parameters.splice([error.index], keys.length))}】}`
                }
                ctx.status = 400;
                ctx.body = {
                    msg: msg,
                    err: error,
                };
                return

            }

            ctx.status = 200;
            ctx.body = {
                msg: "操作成功",
                data: {
                    filePath,
                    fileName
                }
            };
        } catch (error) {
            ctx.status = 400;
            ctx.body = {
                msg: "解析错误",
                err: error,
            };
        }
    }
}