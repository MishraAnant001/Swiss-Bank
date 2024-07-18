import { Router } from "express";
import { AccountController } from "../controllers";
import { authenticate, authorize } from "../middlewares";

export const accountRouter =Router()
const controller = new AccountController()

accountRouter.post("/",authenticate,authorize(['user']),controller.createAccount)
accountRouter.get("/",authenticate,authorize(['admin']),controller.getAllAccounts)
accountRouter.get("/getbyadmin/:id",authenticate,authorize(['admin']),controller.getAccountByUser)
accountRouter.get("/user",authenticate,authorize(['user']),controller.getAccountByUser)
accountRouter.put("/:id",authenticate,authorize(['user','admin']),controller.updateAccount)
accountRouter.delete("/:id",authenticate,authorize(['user','admin']),controller.deleteAccount)
accountRouter.get("/transaction-history",authenticate,authorize(['user']),controller.getTransHistory)