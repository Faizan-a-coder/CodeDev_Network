import express from "express";
import { register,login,getUser,adminLogin,adminRegister } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.get('/me',authMiddleware,getUser);
authRouter.post('/admin/register',adminRegister);
authRouter.post('/admin/login',adminLogin);

export default authRouter;