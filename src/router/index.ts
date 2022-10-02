import Router from "@koa/router";

import AuthController from "../controllers/auth";
import UserController from "../controllers/user";
import ScoreController from "../controllers/score";

const unprotectedRouter = new Router()
const protectedRouter = new Router()

// auth 相关的路由
unprotectedRouter.post('/auth/login', AuthController.login);
unprotectedRouter.post('/auth/register', AuthController.register);

// users 相关的路由
protectedRouter.get('/users', UserController.listUsers);
protectedRouter.get('/users/:id', UserController.showUserDetail);
protectedRouter.put('/users/:id', UserController.updateUser);
protectedRouter.delete('/users/:id', UserController.deleteUser);

// scores 相关的路由
protectedRouter.post('/scores', ScoreController.listScore);
protectedRouter.post('/scores/update', ScoreController.updateScore);
protectedRouter.put('/scores/add', ScoreController.addScore);
protectedRouter.delete('/scores/del/:id', ScoreController.delScore);
protectedRouter.post('/scores/excel', ScoreController.uploadExcel);

export { protectedRouter, unprotectedRouter };

