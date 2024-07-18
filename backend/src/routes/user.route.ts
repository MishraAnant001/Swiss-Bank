import { Router } from "express";
import { UserController } from "../controllers";
import { authenticate, authorize } from "../middlewares";
// import { Authentication } from "../middlewares";

export const userRouter = Router()
// const auth = new Authentication()
const controller= new UserController()
userRouter.post("/login",controller.loginUser);
userRouter.post("/signup",controller.signupUser);
userRouter.get("/",authenticate,authorize(['admin']),controller.getAllUsers)
userRouter.get("/:id",authenticate,controller.getUserById)
userRouter.delete("/:id",authenticate,authorize(['admin']),controller.deleteUser)