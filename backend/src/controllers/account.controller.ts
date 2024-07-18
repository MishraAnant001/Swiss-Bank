import { NextFunction, Response } from "express";
import { IAccount, IRequest } from "../interfaces";
import rs from "randomstring"
import { AccountService } from "../services";

const service = new AccountService()

export class AccountController {
    async createAccount(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { account_type, balance } = req.body
            const response = await service.createAccount(req.userid!, account_type as string, balance as number);
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getAllAccounts(req: IRequest, res: Response, next: NextFunction) {
        try {
            const response = await service.getAllAccounts();
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getAccountByUser(req: IRequest, res: Response, next: NextFunction) {
        try {
            if (req.role == "admin") {
                const { id } = req.params
                const response = await service.getAccountByUser(id);
                res.status(response.statusCode).json(response)
            } else {
                const response = await service.getAccountByUser(req.userid!);
                res.status(response.statusCode).json(response)
            }
        } catch (error) {
            next(error)
        }
    }
    async updateAccount(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const { balance } = req.body
            const response = await service.updateAccount(id, parseInt(balance));
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }
    async deleteAccount(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const response = await service.deleteAccount(id);
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getTransHistory(req: IRequest, res: Response, next: NextFunction) {
        try {
            const response = await service.getTransHistory(req.userid!);
            res.status(response.statusCode).json(response)
        } catch (error) {
            next(error)
        }
    }


}