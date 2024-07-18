import { NextFunction, Response } from "express";
import { IRequest, ITransaction } from "../interfaces";
import { TransactionService } from "../services";

const service = new TransactionService()
export class TransactionController {
    async generateTxn(req: IRequest, res: Response, next: NextFunction) {
        try {
            const txnData: ITransaction = req.body
            const response = await service.generateTxn(txnData);
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
    async getAllTxn(req: IRequest, res: Response, next: NextFunction) {
        try {
            const{startDate,endDate}=req.body
            const response = await service.getAllTransactions(startDate as Date,endDate as Date);
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
    async getTxnByAccount(req: IRequest, res: Response, next: NextFunction) {
        try {
            const {id}=req.params
            const response = await service.getTxnByAccount(id);
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
}