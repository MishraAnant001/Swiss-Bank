import mongoose from "mongoose";
import { ACCOUNT_MESSAGES, ERROR_CODES, SUCCESS_CODES } from "../constants";
import { IAccount } from "../interfaces";
import { Account, Transaction } from "../models";
import { ApiError, ApiResponse, generateString } from "../utils";
import { TransactionService } from "./transaction.service";
const service = new TransactionService()
export class AccountService {
    async createAccount(userid: string, account_type: string,balance:number) {
        const account_number = generateString(14, ['numeric'])
        const data = await Account.create({
            user: userid,
            account_number: account_number,
            account_type: account_type,
            balance:balance
        })
        return new ApiResponse(SUCCESS_CODES.CREATED, data, ACCOUNT_MESSAGES.CREATE_SUCCESS)
    }

    async getAllAccounts() {
        const data = await Account.find({isActive:true})
        return new ApiResponse(SUCCESS_CODES.OK, data, ACCOUNT_MESSAGES.FETCH_SUCCESS)
    }

    async getAccountByUser(id: string) {
        const data = await Account.find({ user: new mongoose.Types.ObjectId(id) ,isActive:true})
        if (data.length==0) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, ACCOUNT_MESSAGES.NOT_FOUND)
        }
        return new ApiResponse(SUCCESS_CODES.OK, data, ACCOUNT_MESSAGES.FETCH_SUCCESS)
    }
    async updateAccount(id: string, balance: number) {
        const data = await Account.findByIdAndUpdate(id, { balance: balance }, { new: true })
        if (!data) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, ACCOUNT_MESSAGES.NOT_FOUND)
        }
        return new ApiResponse(SUCCESS_CODES.OK, data, ACCOUNT_MESSAGES.UPDATE_SUCCESS)
    }
    async deleteAccount(id: string) {
        const data = await Account.findByIdAndUpdate(id,{isActive:false})
        if (!data) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, ACCOUNT_MESSAGES.NOT_FOUND)
        }
        return new ApiResponse(SUCCESS_CODES.OK, data, ACCOUNT_MESSAGES.DELETE_SUCCESS)
    }

    async getTransHistory(id:string){
        const accounts = await Account.find({ user: new mongoose.Types.ObjectId(id) ,isActive:true})
        if (accounts.length==0) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, ACCOUNT_MESSAGES.NOT_FOUND)
        }
        // console.log(accounts);
        let transactions:any[]=[]
        for (const account of accounts) {
            const transaction = await Transaction.find({ $or: [{ from_account: account._id }, { to_account: account._id }] })
            if(transaction.length!=0){
                const response = await service.getTxnByAccount(String(account._id))
                transactions=[...transactions,...response.data]
            }
        }
        return new ApiResponse(SUCCESS_CODES.OK,transactions)
    }
}