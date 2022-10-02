import Koa from 'koa';
import cors from '@koa/cors';
// import bodyParser from 'koa-bodyparser';
import koaBody from 'koa-body';
import { createConnection } from "typeorm";
import 'reflect-metadata';
import jwt from 'koa-jwt';
import path from 'path';

import { logger } from "./middlewares/logger";
import { JWT_SECRET } from './constants';
import { unprotectedRouter, protectedRouter } from "./router";

createConnection().then(() => {
  // 初始化 Koa 应用实例
  const app = new Koa();

  // 注册中间件
  app.use(logger())
  app.use(cors());
  app.use(koaBody({
    // 支持文件格式
    multipart: true,
    formidable: {
      // 上传目录
      uploadDir: path.join(__dirname, 'public/uploads'),
      // 保留文件扩展名
      keepExtensions: true,
    }
  }));
  // app.use(bodyParser());


  // 响应用户请求
  app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods())
  app.use(jwt({ secret: JWT_SECRET }).unless({ method: "POST" }))
  app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());
  // 运行服务器
  app.listen(3333);
})
  .catch((err: string) => console.log('TypeORM connection error:', err));




// --- 创建数据库
// CREATE DATABASE student;

// --- 创建用户并授予权限
// CREATE USER 'admin'@'localhost' IDENTIFIED BY '123456';
// GRANT ALL PRIVILEGES ON student.* TO 'admin'@'localhost';

// --- 处理 MySQL 8.0 版本的认证协议问题
// ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
// flush privileges;