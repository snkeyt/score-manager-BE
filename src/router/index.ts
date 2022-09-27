import Router from "@koa/router";

import AuthController from "../controllers/auth";
import UserController from "../controllers/user";
import ScoreController from "../controllers/score";

const router = new Router()

// auth 相关的路由
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);

// users 相关的路由
router.get('/users', UserController.listUsers);
router.get('/users/:id', UserController.showUserDetail);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// scores 相关的路由
router.post('/scores', ScoreController.listScore);
router.post('/scores/update', ScoreController.updateScore);
router.put('/scores/add', ScoreController.addScore);
router.delete('/scores/del', ScoreController.delScore);

export default router;
