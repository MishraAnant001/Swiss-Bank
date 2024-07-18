import { Router } from "express";
import { authenticate, authorize } from "../middlewares";
import { TransactionController } from "../controllers";

export const txnRouter = Router()
const controller = new TransactionController()

txnRouter.post("/",authenticate,authorize(['user','admin']),controller.generateTxn)
txnRouter.get("/",authenticate,authorize(['admin']),controller.getAllTxn)
txnRouter.get("/:id",authenticate,authorize(['admin','user']),controller.getTxnByAccount)