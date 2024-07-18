import { Router } from "express"
import { userRouter } from "./user.route"
import { accountRouter } from "./account.route"
import { txnRouter } from "./transaction.route"
import { dashboardRouter } from "./dashboard.route"

export const mainRouter= Router()

mainRouter.use("/api/v1/user",userRouter)
mainRouter.use("/api/v1/account",accountRouter)
mainRouter.use("/api/v1/transaction",txnRouter)
mainRouter.use("/api/v1/dashboard",dashboardRouter)